import { test } from "node:test";
import assert from "node:assert/strict";
import { evaluateClaim, inpatientDays, type PriorClaim } from "../src/lib/claims.ts";
import type { Ratings } from "../src/lib/rules.ts";

const today = "2027-06-01";
const start = "2026-06-01";

test("inpatient days count nights, min 1", () => {
  assert.equal(inpatientDays("2027-03-01", "2027-03-08"), 7);
  assert.equal(inpatientDays("2027-03-01", "2027-03-01"), 0);
  assert.equal(inpatientDays("2027-03-08", "2027-03-01"), null);
});

test("Pathway A: 8 days → 40 hours + 4m (worked example)", () => {
  const r = evaluateClaim({ parent: "father", pathway: "A", reason: "injury", admissionDate: "2027-03-01", dischargeDate: "2027-03-09" }, [], today, start);
  assert.equal(r.status, "approved");
  assert.equal(r.hoursAwarded, 40);
  assert.equal(r.cashAmount, 4_000_000);
  assert.equal(r.services.length, 4);
});

test("Pathway A: 2-day stay pays cash only", () => {
  const r = evaluateClaim({ parent: "mother", pathway: "A", reason: "illness", admissionDate: "2027-03-01", dischargeDate: "2027-03-03" }, [], today, start);
  assert.equal(r.hoursAwarded, 0);
  assert.equal(r.cashAmount, 1_000_000);
  assert.deepEqual(r.reasons, ["stay_too_short"]);
});

test("Annual limit and cash cap apply per parent", () => {
  const prior: PriorClaim[] = [
    { parent: "father", pathway: "A", status: "approved", admissionDate: "2027-01-01", dischargeDate: "2027-01-28", hoursAwarded: 100, cashDays: 27 },
  ];
  const r = evaluateClaim({ parent: "father", pathway: "A", reason: "illness", admissionDate: "2027-04-01", dischargeDate: "2027-04-15" }, prior, today, start);
  assert.equal(r.hoursAwarded, 20);
  assert.equal(r.cashDays, 3);
  assert.ok(r.reasons.includes("annual_limit_reached"));
  const m = evaluateClaim({ parent: "mother", pathway: "A", reason: "illness", admissionDate: "2027-04-01", dischargeDate: "2027-04-15" }, prior, today, start);
  assert.equal(m.hoursAwarded, 60);
});

test("Re-assessed stay pays only the difference (report 3.2, C.2); future dates go to review", () => {
  const prior: PriorClaim[] = [
    { parent: "father", pathway: "A", status: "approved", admissionDate: "2027-03-01", dischargeDate: "2027-03-09", hoursAwarded: 40, cashDays: 8 },
  ];
  // Same stay extended to 11 nights: still the 7–13 tier, so no extra hours; 3 extra cash days.
  const same = evaluateClaim({ parent: "father", pathway: "A", reason: "illness", admissionDate: "2027-03-05", dischargeDate: "2027-03-12" }, prior, today, start);
  assert.equal(same.status, "approved");
  assert.equal(same.inpatientDays, 11);
  assert.equal(same.hoursAwarded, 0);
  assert.equal(same.cashDays, 3);
  // Extended to 15 nights: moves to the 60-hour tier, so +20 hours and +7 cash days.
  const up = evaluateClaim({ parent: "father", pathway: "A", reason: "illness", admissionDate: "2027-03-01", dischargeDate: "2027-03-16" }, prior, today, start);
  assert.equal(up.hoursAwarded, 20);
  assert.equal(up.cashDays, 7);
  assert.deepEqual(up.reasons, ["episode_upgrade"]);
  // Exact duplicate pays nothing.
  const dup = evaluateClaim({ parent: "father", pathway: "A", reason: "illness", admissionDate: "2027-03-01", dischargeDate: "2027-03-09" }, prior, today, start);
  assert.deepEqual([dup.hoursAwarded, dup.cashDays], [0, 0]);
  assert.deepEqual(dup.reasons, ["no_additional_benefit"]);
  const f = evaluateClaim({ parent: "mother", pathway: "A", reason: "illness", admissionDate: "2027-07-01", dischargeDate: "2027-07-05" }, [], today, start);
  assert.equal(f.status, "review");
});

test("Pregnancy is excluded", () => {
  const r = evaluateClaim({ parent: "mother", pathway: "A", reason: "pregnancy", admissionDate: "2027-03-01", dischargeDate: "2027-03-05" }, [], today, start);
  assert.equal(r.status, "rejected");
});

test("Pathway B", () => {
  const ratings: Ratings = { C1: "F3", C2: "F1", C3: "F2", C4: "F3", C5: "F0", C6: "F1" };
  const r = evaluateClaim({ parent: "mother", pathway: "B", reason: "injury", youngestChildAge: 2, ratings, restrictedDays: 3 }, [], today, start);
  // 0.25 + 0.2*0.25 + 0.2*0.6 + 0.2 + 0 + 0.1*0.25 = 0.645
  assert.equal(r.cisScore, 0.645);
  assert.equal(r.hoursAwarded, 60);
  assert.deepEqual(r.services, ["childcare"]);
  const short = evaluateClaim({ parent: "mother", pathway: "B", reason: "injury", youngestChildAge: 2, ratings, restrictedDays: 1 }, [], today, start);
  assert.equal(short.status, "rejected");
  assert.deepEqual(short.reasons, ["restriction_too_short"]);
});

test("Rider waiting period: 30 days for illness, accidents immediate (Benefit Terms)", () => {
  const ill = evaluateClaim({ parent: "father", pathway: "A", reason: "illness", admissionDate: "2026-06-20", dischargeDate: "2026-06-25" }, [], today, start);
  assert.deepEqual(ill.reasons, ["waiting_period"]);
  const acc = evaluateClaim({ parent: "father", pathway: "A", reason: "injury", admissionDate: "2026-06-20", dischargeDate: "2026-06-25" }, [], today, start);
  assert.equal(acc.hoursAwarded, 20);
  const before = evaluateClaim({ parent: "father", pathway: "A", reason: "injury", admissionDate: "2026-05-20", dischargeDate: "2026-05-25" }, [], today, start);
  assert.deepEqual(before.reasons, ["before_policy_start"]);
});

test("Short stays: 1-2 nights pay cash, same-day discharge pays nothing", () => {
  const one = evaluateClaim({ parent: "mother", pathway: "A", reason: "injury", admissionDate: "2027-03-01", dischargeDate: "2027-03-02" }, [], today, start);
  assert.equal(one.cashAmount, 500_000);
  const zero = evaluateClaim({ parent: "mother", pathway: "A", reason: "injury", admissionDate: "2027-03-01", dischargeDate: "2027-03-01" }, [], today, start);
  assert.equal(zero.cashAmount, 0);
  assert.deepEqual(zero.reasons, ["no_overnight"]);
});
