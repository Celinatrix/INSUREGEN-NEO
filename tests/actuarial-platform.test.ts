import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { DATASETS, DATASET_BY_ID, GROUPS } from "../src/lib/actuarial-db/registry.ts";
import { migrationSql, creationOrder } from "../src/lib/actuarial-db/sql.ts";
import { ActuarialStore } from "../src/lib/actuarial-db/store.ts";
import { toCsv, fromCsv } from "../src/lib/actuarial-db/io.ts";
import { BENCHMARKS } from "../src/lib/actuarial-db/seed.ts";
import { basisFrom, bootstrap, reproduce, run, runSensitivity, recalculate, tablesFrom, treatiesFrom, LIFE_STRESSES } from "../src/lib/actuarial-db/run.ts";
import { combine, interpolate, jointProbability, priceJointLife } from "../src/lib/engine/life.ts";
import { capital, splitClaim } from "../src/lib/engine/reinsurance.ts";
import type { DatasetId, Row } from "../src/lib/actuarial-db/types.ts";

const fresh = () => {
  const s = new ActuarialStore();
  bootstrap(s);
  return s;
};

// 1. Registry -----------------------------------------------------------------

test("Registry: exactly 73 datasets, DB01–DB73 in order, groups A–J", () => {
  assert.equal(DATASETS.length, 73);
  DATASETS.forEach((d, i) => assert.equal(d.id, `DB${String(i + 1).padStart(2, "0")}`));
  for (const d of DATASETS) assert.ok(GROUPS[d.group], `${d.id} has a known group`);
  assert.equal(new Set(DATASETS.map((d) => d.table)).size, 73, "table names are unique");
});

test("Registry: every dataset carries the required metadata", () => {
  for (const d of DATASETS) {
    assert.ok(d.name && d.description && d.source, `${d.id} metadata`);
    assert.ok(d.fields.length > 0, `${d.id} fields`);
    assert.ok(d.primaryKey.length > 0, `${d.id} pk`);
    assert.ok(d.version && d.createdAt && d.updatedAt, `${d.id} version/timestamps`);
    assert.ok(Array.isArray(d.validation), `${d.id} validation rules`);
    const names = new Set(d.fields.map((f) => f.name));
    assert.equal(names.size, d.fields.length, `${d.id} field names unique`);
    for (const k of d.primaryKey) assert.ok(names.has(k), `${d.id} pk ${k} is a field`);
  }
});

test("Registry: foreign keys point at existing datasets and their primary keys", () => {
  for (const d of DATASETS) {
    for (const k of d.foreignKeys) {
      const target = DATASET_BY_ID.get(k.references.dataset);
      assert.ok(target, `${d.id} → ${k.references.dataset} exists`);
      assert.deepEqual(k.references.fields, target!.primaryKey, `${d.id} → ${target!.id} references its PK`);
      for (const f of k.fields) assert.ok(d.fields.some((x) => x.name === f), `${d.id} fk field ${f}`);
    }
  }
});

test("Migration: file is in sync with the registry and tables are created after their references", () => {
  const file = readFileSync(new URL("../supabase/migrations/004_actuarial_datasets.sql", import.meta.url), "utf8").replace(/\r\n/g, "\n");
  assert.equal(file.trim(), migrationSql().replace(/\r\n/g, "\n").trim(), "run scripts/gen-actuarial-migration.ts");
  assert.equal((file.match(/create table/gi) ?? []).length, 74);
  const order = creationOrder().map((d) => d.id);
  for (const d of DATASETS) for (const k of d.foreignKeys) {
    if (k.references.dataset !== d.id) assert.ok(order.indexOf(k.references.dataset) < order.indexOf(d.id), `${k.references.dataset} before ${d.id}`);
  }
});

test("Missing sources are flagged, never filled with invented rows", () => {
  const s = new ActuarialStore();
  for (const d of DATASETS.filter((x) => x.quality === "missing")) assert.equal(s.rows(d.id).length, 0, `${d.id} has no fabricated rows`);
  assert.ok(!DATASETS.some((d) => d.quality === "synthetic"), "no synthetic dataset is seeded");
});

// 2. Validation, import, export -----------------------------------------------

test("Validation: every seeded and bootstrapped dataset passes", () => {
  const s = fresh();
  for (const d of DATASETS) assert.deepEqual(s.validate(d.id, s.rows(d.id)), [], d.id);
});

test("Validation rejects bad probabilities, duplicate keys, unknown fields, broken FKs and unknown data_quality", () => {
  const s = new ActuarialStore();
  const good = s.rows("DB01")[0];
  const bad: Row[] = [
    { ...good, q_death: 1.4 },
    { ...good },
    { ...good, age: 99, mystery: 1 },
    { ...good, age: 98, data_quality: "made_up" },
  ];
  const codes = new Set(s.validate("DB01", bad).map((i) => i.code));
  for (const c of ["duplicate_key", "unknown_field", "not_allowed"]) assert.ok(codes.has(c), c);
  assert.ok(s.validate("DB01", [{ ...good, q_death: 1.4 }]).length > 0, "probability > 1 rejected");
  const db08 = s.rows("DB08")[0];
  if (db08 && "basis_id" in db08) assert.ok(s.validate("DB08", [{ ...db08, basis_id: "NOPE" }]).some((i) => i.code === "foreign_key"));
  const before = s.version("DB01");
  assert.equal(s.replace("DB01", bad, { user: "test", format: "csv" }).ok, false);
  assert.equal(s.version("DB01"), before, "rejected import does not change data");
  assert.equal(s.imports[0].accepted, false, "rejected import is logged");
});

test("Export/import: CSV round-trips a dataset unchanged", () => {
  const s = new ActuarialStore();
  for (const id of ["DB01", "DB09", "DB10", "DB62"] as DatasetId[]) {
    const def = DATASET_BY_ID.get(id)!;
    const rows = s.rows(id);
    const back = fromCsv(def, toCsv(def, rows));
    assert.equal(back.length, rows.length, id);
    assert.deepEqual(s.validate(id, back), [], `${id} re-imports cleanly`);
    for (const f of def.fields) assert.deepEqual(back.map((r) => r[f.name] ?? null), rows.map((r) => r[f.name] ?? null), `${id}.${f.name}`);
  }
});

// 3. Life engine (Appendix A) -------------------------------------------------

test("Rates: mortality and TPD are read from DB01–DB03", () => {
  const s = new ActuarialStore();
  const t = tablesFrom(s);
  const row = s.rows("DB01").find((r) => r.sex === "M" && r.age === 40)!;
  assert.equal(t.death.M.get(40), row.q_death);
  assert.ok(t.tpdBase.M.size >= 30 && t.tpdBase.F.size >= 30);
});

test("Interpolation and combination formulas", () => {
  const r = interpolate(new Map([[40, 0.002], [45, 0.003]]), 42);
  assert.equal(r.lower, 40);
  assert.equal(r.upper, 45);
  assert.ok(Math.abs(r.value - 0.0024) < 1e-12);
  assert.throws(() => interpolate(new Map([[40, 0.002]]), 50));
  assert.ok(Math.abs(combine(0.01, 0.02) - (1 - 0.99 * 0.98)) < 1e-15);
  assert.ok(Math.abs(jointProbability(0.01, 0.02, { model: "independent", share: 0 }) - (1 - 0.99 * 0.98)) < 1e-15);
  assert.equal(jointProbability(0.01, 0.02, { model: "mixture", share: 1 } as never), 0.02);
});

test("Pricing: net and gross premiums match the report benchmarks (Tables 4.2, 3.4)", () => {
  const s = new ActuarialStore();
  const basis = basisFrom(s);
  const tables = tablesFrom(s);
  for (const b of BENCHMARKS) {
    const L = priceJointLife(b.father, b.mother, tables, basis);
    const actual = b.metric === "net_premium" ? L.netPremium : L.grossPremium;
    assert.ok(Math.abs(actual - b.expected) <= b.tolerance, `${b.check_id}: ${actual} vs ${b.expected}`);
  }
  const L = priceJointLife(40, 40, tables, basis);
  assert.ok(Math.abs(L.netPremium - basis.sumAssured * L.A / L.annuityDue) < 1e-6, "PN = SA·A/ä");
  assert.ok(Math.abs(L.grossPremium - L.grossNumerator / L.grossDenominator) < 1e-6, "G = numerator / denominator");
});

test("Pricing changes when an assumption changes (no hardcoded premium)", () => {
  const s = new ActuarialStore();
  const base = run(s, { fatherAge: 40, motherAge: 40 }).life.grossPremium;
  const stressed = run(s, { fatherAge: 40, motherAge: 40, overrides: { mortalityMultiplier: 1.2 } }).life.grossPremium;
  assert.ok(stressed > base);
});

// 4. Reserves -----------------------------------------------------------------

test("Reserves: held = max(0, FPT, corrected gross), zero at expiry, recursion closes", () => {
  const s = new ActuarialStore();
  const r = run(s, { fatherAge: 40, motherAge: 40 });
  for (const x of r.reserve.rows) {
    assert.ok(Math.abs(x.held - Math.max(0, x.fpt, x.correctedGross)) < 1e-6, `t=${x.t}`);
    assert.ok(x.correctedGross >= x.rawGross - 1e-6, "corrected is shown alongside raw, not replaced by it");
  }
  const last = r.reserve.rows.at(-1)!;
  assert.equal(last.t, r.basis.termYears);
  assert.ok(Math.abs(last.held) < 1e-4, "reserve is 0 at the end of the term");
  for (const d of r.reserve.development) assert.ok(Math.abs(d.residual) < 1e-3, `residual t=${d.t}`);
});

// 5. Reinsurance --------------------------------------------------------------

test("Reinsurance: QS60 splits a 2bn claim into 0.8bn retained and 1.2bn recovered", () => {
  const s = new ActuarialStore();
  const qs = treatiesFrom(s).find((x) => x.treaty.treatyId === "QS60")!;
  assert.ok(qs.selected);
  const split = splitClaim(qs.treaty, 2e9, 2e9);
  assert.ok(Math.abs(split.retained - 8e8) < 1e-3);
  assert.ok(Math.abs(split.recovery - 1.2e9) < 1e-3);
  const gross = capital(null, 2e9, 1e7);
  const net = capital(qs.treaty, 2e9, 1e7);
  assert.ok(net.capital < gross.capital, "reinsurance reduces capital");
});

// 6. Sensitivity, audit, recalculation, reproducibility -----------------------

test("Sensitivity runs every stress through the engine and writes DB71", () => {
  const s = new ActuarialStore();
  const out = runSensitivity(s, 40, 40, "test");
  assert.equal(out.results.length, LIFE_STRESSES.length);
  const death = out.results.find((x) => x.key === "death_x1.2")!;
  assert.ok(death.metrics.gross_premium > out.base.gross_premium);
  assert.equal(s.rows("DB71").filter((r) => r.run_id === out.runId).length, LIFE_STRESSES.length * 4);
});

test("Audit trail: each run is logged in DB73 with inputs, dataset versions, formula version and outputs", () => {
  const s = new ActuarialStore();
  const r = run(s, { fatherAge: 35, motherAge: 33, user: "tester" });
  const a = s.rows("DB73").find((x) => x.run_id === r.runId)!;
  assert.ok(a);
  assert.equal(a.initiated_by, "tester");
  assert.ok(String(a.formula_version).includes("life-A1"));
  assert.ok((a.dataset_versions as Record<string, string>).DB01);
  assert.equal((a.outputs as { grossPremium: number }).grossPremium, r.life.grossPremium);
  for (const id of ["DB21", "DB27", "DB32", "DB37", "DB63"] as DatasetId[]) assert.ok(s.rows(id).some((x) => x.run_id === r.runId), `${id} written`);
});

test("Reproducibility: a stored run recomputes identically, even after its inputs change", () => {
  const s = new ActuarialStore();
  const r = run(s, { fatherAge: 40, motherAge: 40 });
  const db09 = s.rows("DB09").map((x) => (x.purpose === "pricing" ? { ...x, rate: 0.05 } : x));
  assert.ok(s.replace("DB09", db09, { user: "test", format: "csv" }).ok);
  const again = reproduce(s, r.runId);
  assert.ok(again.identical, "uses the dataset revisions recorded with the run");
  assert.ok(again.formulaVersionMatches);
});

test("Recalculation: changing DB09 updates the DB31 tariff", () => {
  const s = fresh();
  const pick = () => Number(s.rows("DB31").find((r) => r.father_age === 40 && r.mother_age === 40)!.gross_premium);
  const before = pick();
  const db09 = s.rows("DB09").map((x) => (x.purpose === "pricing" ? { ...x, rate: 0.05 } : x));
  assert.ok(s.replace("DB09", db09, { user: "test", format: "csv" }).ok);
  recalculate(s);
  const after = pick();
  assert.ok(after < before, `higher interest lowers premium: ${before} → ${after}`);
  assert.ok(s.rows("DB72").some((r) => r.status === "fail"), "DB72 flags the departure from the report basis");
});

test("Bootstrap: DB72 checks all pass on the report basis", () => {
  const s = fresh();
  const checks = s.rows("DB72");
  assert.ok(checks.length >= 9);
  for (const c of checks) assert.equal(c.status, "pass", String(c.check_id));
});
