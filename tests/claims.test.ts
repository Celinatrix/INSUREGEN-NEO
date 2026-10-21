import { test } from "node:test";
import assert from "node:assert/strict";
import { evaluateClaim, inpatientDays, type PriorClaim } from "../src/lib/claims.ts";
import type { Ratings } from "../src/lib/rules.ts";

const today = "2027-06-01";

test("inpatient days count nights, min 1", () => {
  assert.equal(inpatientDays("2027-03-01", "2027-03-08"), 7);
  assert.equal(inpatientDays("2027-03-01", "2027-03-01"), 1);
  assert.equal(inpatientDays("2027-03-08", "2027-03-01"), null);
});

test("Pathway A: 8 days → 40 hours + 4m (worked example)", () => {
  const r = evaluateClaim({ parent: "father", pathway: "A", reason: "injury", admissionDate: "2027-03-01", dischargeDate: "2027-03-09" }, [], today);
  assert.equal(r.status, "approved");
  assert.equal(r.hoursAwarded, 40);
  assert.equal(r.cashAmount, 4_000_000);
  assert.equal(r.services.length, 4);
});

test("Pathway A: 2-day stay pays cash only", () => {
  const r = evaluateClaim({ parent: "mother", pathway: "A", reason: "illness", admissionDate: "2027-03-01", dischargeDate: "2027-03-03" }, [], today);
  assert.equal(r.hoursAwarded, 0);
  assert.equal(r.cashAmount, 1_000_000);
  assert.deepEqual(r.reasons, ["stay_too_short"]);
});

test("Annual limit and cash cap apply per parent", () => {
  const prior: PriorClaim[] = [
    { parent: "father", pathway: "A", status: "approved", admissionDate: "2027-01-01", dischargeDate: "2027-01-28", hoursAwarded: 100, cashDays: 27 },
  ];
  const r = evaluateClaim({ parent: "father", pathway: "A", reason: "illness", admissionDate: "2027-04-01", dischargeDate: "2027-04-15" }, prior, today);
  assert.equal(r.hoursAwarded, 20);
  assert.equal(r.cashDays, 3);
  assert.ok(r.reasons.includes("annual_limit_reached"));
  const m = evaluateClaim({ parent: "mother", pathway: "A", reason: "illness", admissionDate: "2027-04-01", dischargeDate: "2027-04-15" }, prior, today);
  assert.equal(m.hoursAwarded, 60);
});

test("Overlap and future dates go to review", () => {
  const prior: PriorClaim[] = [
    { parent: "father", pathway: "A", status: "approved", admissionDate: "2027-03-01", dischargeDate: "2027-03-09", hoursAwarded: 40, cashDays: 8 },
  ];
  const o = evaluateClaim({ parent: "father", pathway: "A", reason: "illness", admissionDate: "2027-03-05", dischargeDate: "2027-03-12" }, prior, today);
  assert.equal(o.status, "review");
  assert.deepEqual(o.flags, ["overlap"]);
  assert.equal(o.hoursAwarded, 0);
  const f = evaluateClaim({ parent: "mother", pathway: "A", reason: "illness", admissionDate: "2027-07-01", dischargeDate: "2027-07-05" }, [], today);
  assert.equal(f.status, "review");
});

test("Pregnancy is excluded", () => {
  const r = evaluateClaim({ parent: "mother", pathway: "A", reason: "pregnancy", admissionDate: "2027-03-01", dischargeDate: "2027-03-05" }, [], today);
  assert.equal(r.status, "rejected");
});

test("Pathway B", () => {
  const ratings: Ratings = { C1: "F3", C2: "F1", C3: "F2", C4: "F3", C5: "F0", C6: "F1" };
  const r = evaluateClaim({ parent: "mother", pathway: "B", reason: "injury", youngestChildAge: 2, ratings, restrictedDays: 3 }, [], today);
  // 0.25 + 0.2*0.25 + 0.2*0.6 + 0.2 + 0 + 0.1*0.25 = 0.645
  assert.equal(r.cisScore, 0.645);
  assert.equal(r.hoursAwarded, 60);
  assert.deepEqual(r.services, ["childcare"]);
  const short = evaluateClaim({ parent: "mother", pathway: "B", reason: "injury", youngestChildAge: 2, ratings, restrictedDays: 1 }, [], today);
  assert.equal(short.status, "rejected");
  assert.deepEqual(short.reasons, ["restriction_too_short"]);
});
