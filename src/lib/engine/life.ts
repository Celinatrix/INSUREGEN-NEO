// Engine định phí nhân thọ chung (first-to-event: tử vong hoặc TTTBVV), Phụ lục A của báo cáo.
// Mọi tham số đầu vào đến từ dataset (DB01–DB03, DB07–DB10) — không có số phí nào gõ cứng.
// Trả về từng bước tính để trang Workbench hiển thị công thức và số thay vào.

export const LIFE_FORMULA_VERSION = "life-A1-2026.11.1";

export type RateTables = {
  /** DB01: q_death theo giới và tuổi */
  death: { M: Map<number, number>; F: Map<number, number> };
  /** DB02 / DB03: TPD tham chiếu (chưa nhân 1,20) */
  tpdBase: { M: Map<number, number>; F: Map<number, number> };
};

export type LifeBasis = {
  sumAssured: number;
  termYears: number;
  pricingRate: number; // DB09 purpose=pricing
  tpdUplift: number; // DB07
  mortalityMultiplier: number; // DB07 (độ nhạy)
  tpdMultiplier: number; // DB07 (độ nhạy)
  dependence: { model: "independent" | "common_shock"; share: number }; // DB08
  claimHandling: number; // h
  reinsurance: number; // r (phần trăm phí gộp)
  riskMargin: number; // m
  profit: number; // π
  adminPerYear: number; // a
  acquisition: number; // k
  commission: [number, number, number]; // năm 1 / năm 2 / năm 3+
};

export type YearRow = {
  t: number;
  fatherAge: number;
  motherAge: number;
  qDeathFather: number; // bảng nam (M) cho cha, bảng nữ (F) cho mẹ
  qTpdBaseFather: number;
  qTpdFather: number;
  qEventFather: number;
  qDeathMother: number;
  qTpdBaseMother: number;
  qTpdMother: number;
  qEventMother: number;
  qJoint: number;
  pStart: number; // p_t
  vClaim: number; // v^(t+1)
  vPremium: number; // v^t
  commissionRate: number; // c_(t+1)
  claimPv: number; // SA × v^(t+1) × p_t × q_t
};

export type LifeRun = {
  rows: YearRow[];
  pEnd: number; // p_n
  A: number;
  annuityDue: number;
  C: number;
  nsp: number;
  netPremium: number;
  grossPremium: number;
  grossNumerator: number;
  grossDenominator: number;
};

const rate = (m: Map<number, number>, age: number, what: string) => {
  const v = m.get(age);
  if (v === undefined) throw new RangeError(`missing_${what}_age_${age}`);
  if (!(v >= 0 && v <= 1)) throw new RangeError(`invalid_${what}_age_${age}`);
  return v;
};

/** q_D = 1 − (1 − q_death)(1 − q_TPD), độc lập trong một người. */
export const combine = (qDeath: number, qTpd: number) => 1 - (1 - qDeath) * (1 - qTpd);

/**
 * Xác suất sự kiện đầu tiên của cặp. Cơ sở (báo cáo 4.1): độc lập, q = 1 − (1 − q_father)(1 − q_mother).
 * Mở rộng độ nhạy, không có trong báo cáo: hỗn hợp với phụ thuộc dương hoàn toàn,
 * q = (1 − s)·q_indep + s·max(q_father, q_mother); s = 0 là độc lập, s = 1 là đồng biến hoàn toàn.
 */
export function jointProbability(qFather: number, qMother: number, dep: LifeBasis["dependence"]): number {
  const indep = 1 - (1 - qFather) * (1 - qMother);
  if (dep.model === "independent" || dep.share === 0) return indep;
  return (1 - dep.share) * indep + dep.share * Math.max(qFather, qMother);
}

export function priceJointLife(fatherAge: number, motherAge: number, tables: RateTables, b: LifeBasis): LifeRun {
  const v = 1 / (1 + b.pricingRate);
  const rows: YearRow[] = [];
  let p = 1;
  let A = 0;
  let annuityDue = 0;
  let C = 0;
  for (let t = 0; t < b.termYears; t++) {
    const xFather = fatherAge + t;
    const xMother = motherAge + t;
    const qDeathFather = rate(tables.death.M, xFather, "death_male") * b.mortalityMultiplier;
    const qTpdBaseFather = rate(tables.tpdBase.M, xFather, "tpd_male");
    const qTpdFather = qTpdBaseFather * b.tpdUplift * b.tpdMultiplier;
    const qDeathMother = rate(tables.death.F, xMother, "death_female") * b.mortalityMultiplier;
    const qTpdBaseMother = rate(tables.tpdBase.F, xMother, "tpd_female");
    const qTpdMother = qTpdBaseMother * b.tpdUplift * b.tpdMultiplier;
    const qEventFather = combine(Math.min(qDeathFather, 1), Math.min(qTpdFather, 1));
    const qEventMother = combine(Math.min(qDeathMother, 1), Math.min(qTpdMother, 1));
    const qJoint = jointProbability(qEventFather, qEventMother, b.dependence);
    const vClaim = v ** (t + 1);
    const vPremium = v ** t;
    const commissionRate = t === 0 ? b.commission[0] : t === 1 ? b.commission[1] : b.commission[2];
    A += vClaim * p * qJoint;
    annuityDue += vPremium * p;
    C += commissionRate * vPremium * p;
    rows.push({
      t, fatherAge: xFather, motherAge: xMother,
      qDeathFather, qTpdBaseFather, qTpdFather, qEventFather, qDeathMother, qTpdBaseMother, qTpdMother, qEventMother, qJoint,
      pStart: p, vClaim, vPremium, commissionRate, claimPv: b.sumAssured * vClaim * p * qJoint,
    });
    p *= 1 - qJoint;
  }
  const nsp = b.sumAssured * A;
  const netPremium = nsp / annuityDue;
  const grossNumerator = (1 + b.claimHandling) * b.sumAssured * A + b.adminPerYear * annuityDue + b.acquisition;
  const grossDenominator = (1 - b.reinsurance - b.riskMargin - b.profit) * annuityDue - C;
  if (!(grossDenominator > 0)) throw new RangeError("gross_denominator_not_positive");
  return { rows, pEnd: p, A, annuityDue, C, nsp, netPremium, grossPremium: grossNumerator / grossDenominator, grossNumerator, grossDenominator };
}

/** Nội suy tuyến tính cho tuổi thiếu giữa hai tuổi có số liệu (DB04/DB05). */
export function interpolate(known: Map<number, number>, age: number): { value: number; lower: number; upper: number; weightUpper: number } {
  if (known.has(age)) return { value: known.get(age)!, lower: age, upper: age, weightUpper: 0 };
  const ages = [...known.keys()].sort((a, b) => a - b);
  const lower = ages.filter((a) => a < age).pop();
  const upper = ages.find((a) => a > age);
  if (lower === undefined || upper === undefined) throw new RangeError(`cannot_interpolate_age_${age}`);
  const w = (age - lower) / (upper - lower);
  return { value: known.get(lower)! * (1 - w) + known.get(upper)! * w, lower, upper, weightUpper: w };
}
