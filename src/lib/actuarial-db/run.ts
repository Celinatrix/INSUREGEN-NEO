// Điều phối một lần tính: đọc dataset → chạy engine → ghi dataset kết quả → ghi nhật ký DB73.
// Mọi lần tính đều tái lập được từ DB73 (đầu vào + phiên bản dataset + phiên bản công thức).
import { LIFE_FORMULA_VERSION, priceJointLife, type LifeBasis, type LifeRun, type RateTables } from "../engine/life.ts";
import { RESERVE_FORMULA_VERSION, reserves, type ReserveRun } from "../engine/reserve.ts";
import { REINSURANCE_FORMULA_VERSION, capital, cededPremium, splitClaim, type Treaty } from "../engine/reinsurance.ts";
import { BASE_BASIS_ID, BENCHMARKS } from "./seed.ts";
import type { ActuarialStore } from "./store.ts";
import type { DatasetId, Row } from "./types.ts";

export const FORMULA_VERSION = [LIFE_FORMULA_VERSION, RESERVE_FORMULA_VERSION, REINSURANCE_FORMULA_VERSION].join("|");
const INPUT_DATASETS: DatasetId[] = ["DB01", "DB02", "DB03", "DB07", "DB08", "DB09", "DB10", "DB38", "DB62"];
const KEEP_RUNS = 50;

export type Overrides = Partial<LifeBasis> & { valuationRate?: number; cededShare?: number };
export type RunInput = { fatherAge: number; motherAge: number; overrides?: Overrides; user?: string; kind?: "workbench" | "life_pricing" | "tariff" };

export type TreatyResult = {
  treaty: Treaty;
  selected: boolean;
  ceded: { ceded: number; netCost: number };
  claim: { gross: number; retained: number; recovery: number };
  capital: { t: number; reserve: number; sumAtRisk: number; retainedSumAtRisk: number; capitalGross: number; capitalNet: number }[];
};

export type RunResult = {
  runId: string;
  input: { fatherAge: number; motherAge: number; overrides: Overrides };
  basis: LifeBasis & { valuationRate: number };
  versions: Record<string, number>;
  life: LifeRun;
  reserve: ReserveRun;
  reinsurance: TreatyResult[];
  sources: Record<string, string>;
};

const num = (r: Row | undefined, k: string) => {
  const v = r?.[k];
  if (typeof v !== "number") throw new Error(`missing_assumption_${k}`);
  return v;
};

/** Bảng tỷ lệ đọc từ DB01–DB03 ở các phiên bản cho trước. */
export function tablesFrom(store: ActuarialStore, versions: Record<string, number> = {}): RateTables {
  const map = (rows: Row[], key: string, filter?: (r: Row) => boolean) =>
    new Map(rows.filter(filter ?? (() => true)).map((r) => [Number(r.age), Number(r[key])]));
  const db01 = store.rows("DB01", versions.DB01);
  return {
    death: { M: map(db01, "q_death", (r) => r.sex === "M"), F: map(db01, "q_death", (r) => r.sex === "F") },
    tpdBase: { M: map(store.rows("DB02", versions.DB02), "q_tpd_base"), F: map(store.rows("DB03", versions.DB03), "q_tpd_base") },
  };
}

/** Cơ sở định phí đọc từ DB07–DB10, DB38 rồi áp các giá trị ghi đè của người dùng. */
export function basisFrom(store: ActuarialStore, overrides: Overrides = {}, versions: Record<string, number> = {}, basisId = BASE_BASIS_ID) {
  const pick = (id: DatasetId, pred: (r: Row) => boolean) => store.rows(id, versions[id]).find(pred);
  const b10 = pick("DB10", (r) => r.basis_id === basisId);
  const b07 = pick("DB07", (r) => r.basis_id === basisId);
  const b08 = pick("DB08", (r) => r.basis_id === basisId);
  const rate = (purpose: string) => num(pick("DB09", (r) => r.basis_id === basisId && r.purpose === purpose && r.term_year === 0), "rate");
  const b38 = pick("DB38", (r) => r.basis_id === basisId);
  const base: LifeBasis & { valuationRate: number } = {
    sumAssured: num(b10, "sum_assured"),
    termYears: num(b10, "term_years"),
    pricingRate: rate("pricing"),
    tpdUplift: num(b07, "tpd_uplift"),
    mortalityMultiplier: num(b07, "mortality_multiplier"),
    tpdMultiplier: num(b07, "tpd_multiplier"),
    dependence: { model: (b08?.model as "independent" | "common_shock") ?? "independent", share: num(b08, "common_shock_share") },
    claimHandling: num(b10, "claim_handling"),
    reinsurance: num(b10, "reinsurance_allowance"),
    riskMargin: num(b10, "risk_margin"),
    profit: num(b10, "profit_margin"),
    adminPerYear: num(b10, "admin_per_year"),
    acquisition: num(b10, "acquisition"),
    commission: [num(b10, "commission_y1"), num(b10, "commission_y2"), num(b10, "commission_y3_plus")],
    valuationRate: num(b38, "valuation_rate"),
  };
  const { cededShare: _ignored, ...rest } = overrides;
  void _ignored;
  return { ...base, ...rest, dependence: { ...base.dependence, ...(rest.dependence ?? {}) } };
}

export function treatiesFrom(store: ActuarialStore, version?: number): { treaty: Treaty; selected: boolean }[] {
  return store.rows("DB62", version).map((r) => ({
    selected: r.selected === true,
    treaty: {
      treatyId: String(r.treaty_id),
      structure: r.structure as Treaty["structure"],
      cededShare: typeof r.ceded_share === "number" ? r.ceded_share : null,
      retention: typeof r.retention === "number" ? r.retention : null,
      netPremiumAllowance: Number(r.net_premium_allowance),
      capitalReserveFactor: Number(r.capital_reserve_factor),
      capitalSarFactor: Number(r.capital_sar_factor),
    },
  }));
}

let seq = 0;
const newRunId = () => `RUN-${Date.now().toString(36).toUpperCase()}-${(++seq).toString(36).toUpperCase()}`;

/** Tính toàn bộ (không ghi gì) — dùng cho tính mới lẫn tái lập. */
export function compute(store: ActuarialStore, input: RunInput, versions: Record<string, number>): Omit<RunResult, "runId" | "sources"> {
  const overrides = input.overrides ?? {};
  const basis = basisFrom(store, overrides, versions);
  const tables = tablesFrom(store, versions);
  const life = priceJointLife(input.fatherAge, input.motherAge, tables, basis);
  const reserve = reserves(life, basis, basis.valuationRate);
  const reinsurance = treatiesFrom(store, versions.DB62).map(({ treaty, selected }) => {
    const t = selected && overrides.cededShare !== undefined ? { ...treaty, cededShare: overrides.cededShare } : treaty;
    return {
      treaty: t,
      selected,
      ceded: cededPremium(t, life.grossPremium, basis.sumAssured),
      claim: splitClaim(t, basis.sumAssured, basis.sumAssured),
      capital: reserve.rows.map((r) => {
        const gross = capital(null, basis.sumAssured, r.held);
        const net = capital(t, basis.sumAssured, r.held);
        return { t: r.t, reserve: r.held, sumAtRisk: gross.sumAtRisk, retainedSumAtRisk: net.retainedSumAtRisk, capitalGross: gross.capital, capitalNet: net.capital };
      }),
    };
  });
  return { input: { fatherAge: input.fatherAge, motherAge: input.motherAge, overrides }, basis, versions, life, reserve, reinsurance };
}

/** Chạy, ghi kết quả vào các dataset tính toán và nhật ký DB73. */
export function run(store: ActuarialStore, input: RunInput): RunResult {
  const versions = Object.fromEntries(INPUT_DATASETS.map((id) => [id, store.revision(id)]));
  const r = compute(store, input, versions);
  const runId = newRunId();
  const VND = "VND";
  const L = r.life;

  store.append("DB73", [{
    run_id: runId, kind: input.kind ?? "life_pricing", initiated_by: input.user ?? "anonymous", started_at: new Date().toISOString(),
    formula_version: FORMULA_VERSION,
    dataset_versions: Object.fromEntries(INPUT_DATASETS.map((id) => [id, store.version(id)])),
    inputs: { fatherAge: input.fatherAge, motherAge: input.motherAge, overrides: input.overrides ?? {}, revisions: versions },
    outputs: { netPremium: L.netPremium, grossPremium: L.grossPremium, A: L.A, annuityDue: L.annuityDue, heldReserveT2: r.reserve.rows[2]?.held ?? 0 },
    status: "ok",
  }]);

  store.append("DB06", L.rows.map((y) => ({ run_id: runId, t: y.t, father_age: y.fatherAge, mother_age: y.motherAge, exposure: y.pStart })));
  store.append("DB21", L.rows.map((y) => ({ run_id: runId, t: y.t, q_joint: y.qJoint })));
  store.append("DB22", L.rows.flatMap((y) => [
    { run_id: runId, t: y.t, role: "father", age: y.fatherAge, q_death: y.qDeathFather },
    { run_id: runId, t: y.t, role: "mother", age: y.motherAge, q_death: y.qDeathMother },
  ]));
  store.append("DB23", L.rows.flatMap((y) => [
    { run_id: runId, t: y.t, role: "father", age: y.fatherAge, q_tpd_base: y.qTpdBaseFather, q_tpd: y.qTpdFather },
    { run_id: runId, t: y.t, role: "mother", age: y.motherAge, q_tpd_base: y.qTpdBaseMother, q_tpd: y.qTpdMother },
  ]));
  store.append("DB24", L.rows.flatMap((y) => [
    { run_id: runId, t: y.t, role: "father", q_event: y.qEventFather },
    { run_id: runId, t: y.t, role: "mother", q_event: y.qEventMother },
  ]));
  store.append("DB25", [...L.rows.map((y) => ({ run_id: runId, t: y.t, p_survive: y.pStart })), { run_id: runId, t: L.rows.length, p_survive: L.pEnd }]);
  store.append("DB26", L.rows.map((y) => ({ run_id: runId, t: y.t, expected_claim: r.basis.sumAssured * y.pStart * y.qJoint, currency: VND, discount_factor: y.vClaim, present_value: y.claimPv })));
  store.append("DB27", [{ run_id: runId, A: L.A, nsp: L.nsp, currency: VND }]);
  store.append("DB28", [{ run_id: runId, annuity_due: L.annuityDue, net_premium: L.netPremium, currency: VND }]);
  store.append("DB29", [{ run_id: runId, h_claims: r.basis.claimHandling, r_reinsurance: r.basis.reinsurance, m_risk: r.basis.riskMargin, pi_profit: r.basis.profit, a_admin: r.basis.adminPerYear, k_acquisition: r.basis.acquisition, gross_premium: L.grossPremium, currency: VND }]);
  store.append("DB30", L.rows.map((y) => ({ run_id: runId, t: y.t, commission_rate: y.commissionRate, pv_factor: y.commissionRate * y.vPremium * y.pStart })));
  store.append("DB32", [{ run_id: runId, father_age: input.fatherAge, mother_age: input.motherAge, sum_assured: r.basis.sumAssured, net_premium: L.netPremium, gross_premium: L.grossPremium, currency: VND, formula_version: FORMULA_VERSION }]);
  const reserveSets: [DatasetId, keyof ReserveRun["rows"][number]][] = [["DB33", "net"], ["DB34", "rawGross"], ["DB35", "fpt"], ["DB36", "correctedGross"], ["DB37", "held"]];
  for (const [id, key] of reserveSets) store.append(id, r.reserve.rows.map((x) => ({ run_id: runId, t: x.t, reserve: x[key] as number, currency: VND })));
  store.append("DB39", r.reserve.development.map((d) => ({ run_id: runId, t: d.t, opening: d.opening, premium_less_expense: d.premiumLessExpense, interest: d.interest, expected_claim: d.expectedClaim, closing: d.closing, residual: d.residual, currency: VND })));
  for (const tr of r.reinsurance) {
    store.append("DB63", [{ run_id: runId, treaty_id: tr.treaty.treatyId, gross_premium: L.grossPremium, ceded_premium: tr.ceded.ceded, net_cost: tr.ceded.netCost, currency: VND }]);
    store.append("DB64", [{ run_id: runId, treaty_id: tr.treaty.treatyId, gross_claim: tr.claim.gross, recovery: tr.claim.recovery, retained: tr.claim.retained, currency: VND }]);
    store.append("DB65", tr.capital.map((c) => ({ run_id: runId, treaty_id: tr.treaty.treatyId, t: c.t, reserve: c.reserve, sum_at_risk_gross: c.sumAtRisk, sum_at_risk_retained: c.retainedSumAtRisk, capital_gross: c.capitalGross, capital_net: c.capitalNet, currency: VND })));
  }

  // Giữ kết quả chi tiết của KEEP_RUNS lần tính gần nhất; nhật ký DB73 giữ toàn bộ.
  const keep = new Set(store.rows("DB73").slice(-KEEP_RUNS).map((x) => String(x.run_id)));
  for (const id of ["DB06", "DB21", "DB22", "DB23", "DB24", "DB25", "DB26", "DB27", "DB28", "DB29", "DB30", "DB32", "DB33", "DB34", "DB35", "DB36", "DB37", "DB39", "DB63", "DB64", "DB65", "DB71"] as DatasetId[]) {
    store.prune(id, keep);
  }

  const sources = Object.fromEntries(INPUT_DATASETS.map((id) => [id, store.def(id).source]));
  return { runId, ...r, sources };
}

/** Tái lập một lần tính đã lưu bằng đúng đầu vào và phiên bản dữ liệu của nó. */
export function reproduce(store: ActuarialStore, runId: string) {
  const audit = store.rows("DB73").find((x) => x.run_id === runId);
  if (!audit) throw new Error("run_not_found");
  const inputs = audit.inputs as { fatherAge: number; motherAge: number; overrides: Overrides; revisions: Record<string, number> };
  const again = compute(store, { fatherAge: inputs.fatherAge, motherAge: inputs.motherAge, overrides: inputs.overrides }, inputs.revisions);
  const before = audit.outputs as { netPremium: number; grossPremium: number };
  return {
    runId,
    formulaVersionMatches: audit.formula_version === FORMULA_VERSION,
    netPremium: { stored: before.netPremium, recomputed: again.life.netPremium },
    grossPremium: { stored: before.grossPremium, recomputed: again.life.grossPremium },
    identical: before.netPremium === again.life.netPremium && before.grossPremium === again.life.grossPremium,
  };
}

/** DB31: biểu phí nhân thọ cho mọi cặp tuổi 25–40, tính từ dataset hiện hành. */
export function buildTariff(store: ActuarialStore) {
  const basis = basisFrom(store);
  const tables = tablesFrom(store);
  const rows: Row[] = [];
  for (let f = 25; f <= 40; f++) {
    for (let m = 25; m <= 40; m++) {
      const L = priceJointLife(f, m, tables, basis);
      rows.push({ basis_id: BASE_BASIS_ID, father_age: f, mother_age: m, net_premium: L.netPremium, gross_premium: L.grossPremium, currency: "VND" });
    }
  }
  return store.replace("DB31", rows, { user: "system", format: "engine" });
}

/** DB72: đối chiếu engine với mốc trong báo cáo. */
export function runValidation(store: ActuarialStore) {
  const basis = basisFrom(store);
  const tables = tablesFrom(store);
  const rows: Row[] = BENCHMARKS.map((b) => {
    const L = priceJointLife(b.father, b.mother, tables, basis);
    const actual = b.metric === "net_premium" ? L.netPremium : L.grossPremium;
    return { check_id: b.check_id, metric: b.metric, expected: b.expected, actual, tolerance: b.tolerance, status: Math.abs(actual - b.expected) <= b.tolerance ? "pass" : "fail", benchmark_source: b.benchmark_source };
  });
  const qs = treatiesFrom(store).find((x) => x.treaty.treatyId === "QS60");
  if (qs) {
    const split = splitClaim(qs.treaty, basis.sumAssured, basis.sumAssured);
    rows.push({ check_id: "T6.9-QS60-retained", metric: "retained_claim", expected: 800_000_000, actual: split.retained, tolerance: 0.5, status: Math.abs(split.retained - 8e8) <= 0.5 ? "pass" : "fail", benchmark_source: "Report 6.6, Table 6.9" });
    rows.push({ check_id: "T6.9-QS60-recovery", metric: "reinsurer_share", expected: 1_200_000_000, actual: split.recovery, tolerance: 0.5, status: Math.abs(split.recovery - 1.2e9) <= 0.5 ? "pass" : "fail", benchmark_source: "Report 6.6, Table 6.9" });
  }
  return store.replace("DB72", rows, { user: "system", format: "engine" });
}

/** Chuẩn bị kho: biểu phí, đối chiếu và một lần tính cơ sở 40/40 để dataset kết quả có dữ liệu. */
export function bootstrap(store: ActuarialStore) {
  if (store.rows("DB73").length > 0) return;
  buildTariff(store);
  runValidation(store);
  runSensitivity(store, 40, 40, "system");
}

/** Các kịch bản độ nhạy thuộc phạm vi định phí nhân thọ (mục 5.2, 8 của yêu cầu); VNB/NPV/IRR thuộc engine tài chính. */
export const LIFE_STRESSES: { key: string; label: string; overrides: Overrides }[] = [
  { key: "death_x1.2", label: "Death claims ×1.2", overrides: { mortalityMultiplier: 1.2 } },
  { key: "tpd_x1.5", label: "TPD claims ×1.5", overrides: { tpdMultiplier: 1.5 } },
  { key: "tpd_x2.0", label: "TPD claims ×2.0", overrides: { tpdMultiplier: 2 } },
  { key: "death_tpd_x1.2", label: "Death and TPD claims ×1.2", overrides: { mortalityMultiplier: 1.2, tpdMultiplier: 1.2 } },
  { key: "death_tpd_x1.5", label: "Death and TPD claims ×1.5", overrides: { mortalityMultiplier: 1.5, tpdMultiplier: 1.5 } },
  { key: "reinsurance_7pct", label: "Reinsurance cost 7%", overrides: { reinsurance: 0.07 } },
  { key: "valuation_2pct", label: "Valuation rate 2%", overrides: { valuationRate: 0.02 } },
  { key: "valuation_4pct", label: "Valuation rate 4%", overrides: { valuationRate: 0.04 } },
];

/** DB71: chạy từng kịch bản bằng engine thật, so với cơ sở, cho một cặp tuổi. */
export function runSensitivity(store: ActuarialStore, fatherAge = 40, motherAge = 40, user = "system") {
  const base = run(store, { fatherAge, motherAge, user, kind: "life_pricing" });
  const metrics = (x: Omit<RunResult, "runId" | "sources">) => {
    const sel = x.reinsurance.find((t) => t.selected) ?? x.reinsurance[0];
    return {
      gross_premium: x.life.grossPremium,
      net_premium: x.life.netPremium,
      held_reserve_t5: x.reserve.rows[5]?.held ?? 0,
      capital_net_t5: sel?.capital[5]?.capitalNet ?? 0,
    };
  };
  const baseM = metrics(base);
  const rows: Row[] = [];
  const results = LIFE_STRESSES.map((s) => {
    const x = compute(store, { fatherAge, motherAge, overrides: s.overrides }, base.versions);
    const m = metrics(x);
    for (const k of Object.keys(m) as (keyof typeof m)[]) {
      rows.push({ run_id: base.runId, scenario: s.key, metric: k, base_value: baseM[k], stressed_value: m[k], scope: "life_pricing" });
    }
    return { ...s, metrics: m };
  });
  store.append("DB71", rows);
  return { runId: base.runId, base: baseM, results };
}

/** Sau khi dữ liệu đầu vào đổi: tính lại mọi kết quả phụ thuộc (biểu phí, đối chiếu, độ nhạy cơ sở). */
export function recalculate(store: ActuarialStore) {
  const tariff = buildTariff(store);
  const validation = runValidation(store);
  const sensitivity = runSensitivity(store, 40, 40, "system");
  return { tariff: tariff.ok, validation: validation.ok, sensitivityRun: sensitivity.runId };
}

export const RECALC_TRIGGERS = new Set<DatasetId>(INPUT_DATASETS);
