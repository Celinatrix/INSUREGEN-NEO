// Định phí minh họa Family Reconnect.
// Phí bổ trợ: tra bảng mục 4.2.3 (khớp sheet Family Tariffs của file định phí bổ trợ).
// Phí nhân thọ: tính trực tiếp bằng engine trong actuarial.ts (CSO 1980, TPD × 1,2, lãi suất 4,5%,
// phí và hoa hồng theo năm), khớp file Excel định phí cho mọi cặp tuổi 25–40.
import { ELIGIBILITY, LIFE_PREMIUM_POINTS, RIDER_RATES, childBandFor } from "./product.ts";
import { jointLife, type LifeAssumptions } from "./actuarial.ts";

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
