import { test } from "node:test";
import assert from "node:assert/strict";
import {
  allocateBooking,
  capToAnnualLimit,
  cisScore,
  hospitalCash,
  pathwayAHours,
  pathwayBHours,
  unlockedServices,
  type Grant,
  type Ratings,
} from "../src/lib/rules.ts";
import { quote, validateQuote } from "../src/lib/pricing.ts";

const none: Ratings = { C1: "F0", C2: "F0", C3: "F0", C4: "F0", C5: "F0", C6: "F0" };

test("Pathway A tiers (Table 3.2)", () => {
  assert.equal(pathwayAHours(2), 0);
  assert.equal(pathwayAHours(3), 20);
  assert.equal(pathwayAHours(6), 20);
  assert.equal(pathwayAHours(7), 40);
  assert.equal(pathwayAHours(8), 40);
  assert.equal(pathwayAHours(13), 40);
  assert.equal(pathwayAHours(14), 60);
  assert.equal(pathwayAHours(2, 48), 60);
  assert.equal(pathwayAHours(1, 72), 0); // ICU tier needs at least 2 inpatient days
});

test("Hospital cash: 500k/day, 30 days a year (worked example: 8 days = 4m)", () => {
  assert.deepEqual(hospitalCash(8), { paidDays: 8, amount: 4_000_000 });
  assert.deepEqual(hospitalCash(10, 25), { paidDays: 5, amount: 2_500_000 });
  assert.deepEqual(hospitalCash(5, 30), { paidDays: 0, amount: 0 });
});

test("CIS score and Pathway B awards", () => {
  const r: Ratings = { ...none, C1: "F3", C3: "F2", C4: "F3" };
  // 0-2: 0.25*1 + 0.2*0.6 + 0.2*1 = 0.57
  assert.equal(cisScore("0-2", r), 0.57);
  assert.equal(pathwayBHours(0.57, r), 40);
  assert.equal(pathwayBHours(cisScore("0-2", none), none), 0);
  const allF3: Ratings = { C1: "F3", C2: "F3", C3: "F3", C4: "F3", C5: "F3", C6: "F3" };
  assert.equal(cisScore("9-12", allF3), 1);
  assert.equal(pathwayBHours(1, allF3), 80);
  // F1 alone never unlocks hours
  const f1: Ratings = { C1: "F1", C2: "F1", C3: "F1", C4: "F1", C5: "F1", C6: "F1" };
  assert.equal(pathwayBHours(cisScore("0-2", f1), f1), 0);
});

test("Pathway B unlocks only matching services", () => {
  assert.deepEqual(unlockedServices("B", { ...none, C5: "F2" }), ["transport"]);
  assert.deepEqual(unlockedServices("B", { ...none, C4: "F3", C2: "F2" }), ["childcare", "meals"]);
  assert.equal(unlockedServices("A").length, 4);
});

test("Annual limit of 120 hours per parent", () => {
  assert.equal(capToAnnualLimit(60, 100), 20);
  assert.equal(capToAnnualLimit(40, 0), 40);
});

test("Booking: transport costs 2 per trip, housekeeping 30% cap, FIFO", () => {
  const g: Grant[] = [
    { id: "a", hours: 40, services: ["childcare", "meals", "transport", "housekeeping"], used: 0, housekeepingUsed: 0, createdAt: "2027-01-01", expiresOn: "2027-03-31" },
  ];
  // worked example: 30h childcare + 5 escorted trips of 1h = 40 credits
  const r1 = allocateBooking(g, "childcare", 30, "2027-01-10");
  assert.ok(r1.ok && r1.credits === 30);
  const r2 = allocateBooking(g, "transport", 5, "2027-01-10");
  assert.ok(r2.ok && r2.credits === 10);
  const hk = allocateBooking(g, "housekeeping", 13, "2027-01-10");
  assert.equal(hk.ok, false); // cap is 12 of 40
  assert.ok(allocateBooking(g, "housekeeping", 12, "2027-01-10").ok);
  const b: Grant[] = [{ id: "b", hours: 20, services: ["transport"], used: 0, housekeepingUsed: 0, createdAt: "2027-01-01", expiresOn: "2027-03-31" }];
  const r3 = allocateBooking(b, "childcare", 1, "2027-01-10");
  assert.equal(r3.ok, false);
  if (!r3.ok) assert.equal(r3.reason, "service_not_unlocked");
});

test("Pricing matches the report", () => {
  const q = quote({ fatherAge: 34, motherAge: 30, youngestChildAge: 3 });
  assert.equal(q.total, 22_607_760); // Table 3.4
  const a = quote({ fatherAge: 25, motherAge: 25, youngestChildAge: 1 });
  assert.equal(Math.round((a.total ?? 0) / 1e4) / 100, 15.84); // Table 2.4
  const b = quote({ fatherAge: 40, motherAge: 40, youngestChildAge: 0 });
  assert.equal(Math.round((b.total ?? 0) / 1e4) / 100, 41.08);
  assert.ok(quote({ fatherAge: 31, motherAge: 29, youngestChildAge: 4 }).life > 0);
  assert.equal(validateQuote({ fatherAge: 41, motherAge: 30, youngestChildAge: 2 })?.field, "fatherAge");
  assert.equal(validateQuote({ fatherAge: 30, motherAge: 30, youngestChildAge: 12 })?.field, "youngestChildAge");
});

test("Grants expire after 90 days", () => {
  const g: Grant[] = [{ id: "a", hours: 20, services: ["childcare"], used: 0, housekeepingUsed: 0, createdAt: "2027-01-01", expiresOn: "2027-03-31" }];
  assert.equal(allocateBooking(g, "childcare", 2, "2027-04-01").ok, false);
  const r = allocateBooking(g, "childcare", 2, "2027-03-31");
  assert.ok(r.ok);
});

test("Underwriting loads and illustration", async () => {
  const { loadedLife, illustrate, affordability } = await import("../src/lib/pricing.ts");
  assert.deepEqual(loadedLife(20_000_000, { smoker: "none", fatherOccupation: 1, motherOccupation: 1 }), [20_000_000, 20_000_000]);
  // smoker +20–35%, father class 3: +1–1.5‰ × 2bn = 2–3m
  assert.deepEqual(loadedLife(20_000_000, { smoker: "father", fatherOccupation: 3, motherOccupation: 1 }), [26_000_000, 30_000_000]);
  const rows = illustrate({ fatherAge: 34, motherAge: 30, youngestChildAge: 3 });
  assert.equal(rows.length, 10);
  assert.equal(rows[0].totalLow, 22_607_760);
  assert.equal(rows[3].rider, 1_807_952); // child 6, older parent 37
  assert.equal(rows[6].rider, 1_833_607); // child 9, father 40 → older band
  assert.equal(rows[9].rider, 1_833_607); // child 12, still renews
  assert.equal(rows[0].surrenderValue, 0);
  const late = illustrate({ fatherAge: 30, motherAge: 30, youngestChildAge: 8 });
  assert.equal(late[5].rider, null); // child 13 → no renewal
  const a = affordability(30_000_000, 33_000_000, 250_000_000);
  assert.equal(a.overCap, true);
  assert.equal(a.belowMinIncome, false);
});
