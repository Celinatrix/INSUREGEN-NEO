// Định phí minh họa Family Reconnect.
// Phí bổ trợ: tra bảng mục 4.2.3 (khớp sheet Family Tariffs của file định phí bổ trợ).
// Phí nhân thọ: tính trực tiếp bằng engine trong actuarial.ts (CSO 1980, TPD × 1,2, lãi suất 4,5%,
// phí và hoa hồng theo năm), khớp file Excel định phí cho mọi cặp tuổi 25–40.
import { ELIGIBILITY, LIFE, LIFE_PREMIUM_POINTS, RIDER_RATES, UNDERWRITING, childBandFor } from "./product.ts";
import { grossReserves, jointLife, type LifeAssumptions } from "./actuarial.ts";

export type QuoteInput = { fatherAge: number; motherAge: number; youngestChildAge: number };

export type Quote = {
  life: number;
  rider: number;
  total: number;
  monthly: number;
  shareOfBenchmarkIncome: number;
  incomeNeededAtCap: number;
  lifeNet: number;
};

export type QuoteError = { error: string; field?: keyof QuoteInput };

export function validateQuote(input: QuoteInput): QuoteError | null {
  const { parentAgeMin: lo, parentAgeMax: hi, youngestChildMaxAtEntry } = ELIGIBILITY;
  for (const field of ["fatherAge", "motherAge"] as const) {
    const v = input[field];
    if (!Number.isInteger(v) || v < lo || v > hi) return { error: "parent_age_out_of_range", field };
  }
  const c = input.youngestChildAge;
  if (!Number.isInteger(c) || c < 0 || c > youngestChildMaxAtEntry) {
    return { error: "child_age_out_of_range", field: "youngestChildAge" };
  }
  return null;
}

export function riderPremium(fatherAge: number, motherAge: number, youngestChildAge: number) {
  const older = Math.max(fatherAge, motherAge);
  return RIDER_RATES[older >= 40 ? "40-49" : "25-39"][childBandFor(youngestChildAge)];
}

export type Occupation = 1 | 2 | 3 | 4;
export type Underwriting = {
  smoker: "none" | "father" | "mother" | "both";
  fatherOccupation: Occupation;
  motherOccupation: Occupation;
};
export const STANDARD_UW: Underwriting = { smoker: "none", fatherOccupation: 1, motherOccupation: 1 };

/** Phí nhân thọ sau phụ phí thẩm định, dạng khoảng [thấp, cao] theo Bảng 5.2. */
export function loadedLife(life: number, uw: Underwriting): [number, number] {
  const sm = uw.smoker === "none" ? [0, 0] : UNDERWRITING.smokerLoad;
  const occ = [uw.fatherOccupation, uw.motherOccupation].map((c) => UNDERWRITING.occupationPerMille[c]);
  const occLo = occ.reduce((x, o) => x + (o[0] / 1000) * LIFE.sumAssured, 0);
  const occHi = occ.reduce((x, o) => x + (o[1] / 1000) * LIFE.sumAssured, 0);
  return [Math.round(life * (1 + sm[0]) + occLo), Math.round(life * (1 + sm[1]) + occHi)];
}

export type Affordability = {
  income: number;
  shareLow: number;
  shareHigh: number;
  belowMinIncome: boolean;
  overCap: boolean; // tổng phí (mức cao) > 12% thu nhập ròng
};

export function affordability(totalLow: number, totalHigh: number, income: number): Affordability {
  return {
    income,
    shareLow: totalLow / income,
    shareHigh: totalHigh / income,
    belowMinIncome: income < ELIGIBILITY.minNetIncome,
    overCap: totalHigh > income * ELIGIBILITY.premiumIncomeCap,
  };
}

export type IllustrationRow = {
  year: number;
  fatherAge: number;
  motherAge: number;
  childAge: number;
  lifeLow: number;
  lifeHigh: number;
  rider: number | null; // null = không tái tục (con nhỏ nhất từ 13 tuổi)
  totalLow: number;
  totalHigh: number;
  cumulativeLow: number;
  cumulativeHigh: number;
  inForce: number; // xác suất hợp đồng còn hiệu lực đầu năm
  deathTpdBenefit: number;
  surrenderValue: number; // bảo hiểm tử kỳ: không có giá trị hoàn lại
  reserve: number; // dự phòng phí gộp đầu năm (cơ sở chuẩn)
};

/**
 * Bảng minh họa 10 năm. Phí nhân thọ cố định; phí bổ trợ tra theo tuổi đạt được của bố/mẹ lớn tuổi hơn
 * và con nhỏ nhất ở đầu mỗi năm, theo biểu phí hiện tại (có thể thay đổi khi tái tục).
 */
export function illustrate(input: QuoteInput, uw: Underwriting = STANDARD_UW): IllustrationRow[] {
  const life = Math.round(jointLife(input.fatherAge, input.motherAge).gross);
  const [lifeLow, lifeHigh] = loadedLife(life, uw);
  const reserves = grossReserves(input.fatherAge, input.motherAge);
  let cumLo = 0;
  let cumHi = 0;
  const rows: IllustrationRow[] = [];
  for (let t = 0; t < LIFE.termYears; t++) {
    const f = input.fatherAge + t;
    const m = input.motherAge + t;
    const c = input.youngestChildAge + t;
    const rider = c <= ELIGIBILITY.riderRenewsWhileChildAtMost ? riderPremium(f, m, c) : null;
    const lo = lifeLow + (rider ?? 0);
    const hi = lifeHigh + (rider ?? 0);
    cumLo += lo;
    cumHi += hi;
    rows.push({
      year: t + 1,
      fatherAge: f,
      motherAge: m,
      childAge: c,
      lifeLow,
      lifeHigh,
      rider,
      totalLow: lo,
      totalHigh: hi,
      cumulativeLow: cumLo,
      cumulativeHigh: cumHi,
      inForce: reserves[t].inForce,
      deathTpdBenefit: LIFE.sumAssured,
      surrenderValue: 0,
      reserve: reserves[t].reserve,
    });
  }
  return rows;
}

export function lifePremium(fatherAge: number, motherAge: number, over: Partial<LifeAssumptions> = {}): number {
  return jointLife(fatherAge, motherAge, over).gross;
}

export function quote(input: QuoteInput): Quote {
  const lifeRes = jointLife(input.fatherAge, input.motherAge);
  const life = Math.round(lifeRes.gross); // làm tròn đến đồng như biểu phí
  const rider = riderPremium(input.fatherAge, input.motherAge, input.youngestChildAge);
  const total = life + rider;
  return {
    life,
    lifeNet: Math.round(lifeRes.net),
    rider,
    total,
    monthly: total / 12,
    shareOfBenchmarkIncome: total / ELIGIBILITY.benchmarkIncome,
    incomeNeededAtCap: total / ELIGIBILITY.premiumIncomeCap,
  };
}

// Các cặp tuổi có số minh họa trong báo cáo (dùng để kiểm tra engine).
export const ILLUSTRATED_PAIRS = Object.keys(LIFE_PREMIUM_POINTS).map((k) => {
  const [f, m] = k.split("-").map(Number);
  return { fatherAge: f, motherAge: m };
});
