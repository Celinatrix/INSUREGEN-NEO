// Định phí minh họa Family Reconnect.
// Phí bổ trợ: tra bảng mục 4.2.3 (đầy đủ cho mọi tuổi).
// Phí nhân thọ: hiện chỉ có 4 cặp tuổi minh họa trong báo cáo. Khi có bảng tính định phí
// (CSO 1980, TPD × 1,2, lãi suất 4,5%, phí và hoa hồng theo năm), hàm lifePremium sẽ tính cho mọi cặp tuổi.
import { ELIGIBILITY, LIFE_PREMIUM_POINTS, RIDER_RATES, childBandFor } from "./product.ts";

export type QuoteInput = { fatherAge: number; motherAge: number; youngestChildAge: number };

export type Quote = {
  life: number | null;
  rider: number;
  total: number | null;
  monthly: number | null;
  shareOfBenchmarkIncome: number | null;
  incomeNeededAtCap: number | null;
  lifeSource: "report_point" | "unavailable";
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

export function lifePremium(fatherAge: number, motherAge: number): number | null {
  return LIFE_PREMIUM_POINTS[`${fatherAge}-${motherAge}`] ?? null;
}

export function quote(input: QuoteInput): Quote {
  const life = lifePremium(input.fatherAge, input.motherAge);
  const rider = riderPremium(input.fatherAge, input.motherAge, input.youngestChildAge);
  const total = life === null ? null : life + rider;
  return {
    life,
    rider,
    total,
    monthly: total === null ? null : total / 12,
    shareOfBenchmarkIncome: total === null ? null : total / ELIGIBILITY.benchmarkIncome,
    incomeNeededAtCap: total === null ? null : total / ELIGIBILITY.premiumIncomeCap,
    lifeSource: life === null ? "unavailable" : "report_point",
  };
}

export const ILLUSTRATED_PAIRS = Object.keys(LIFE_PREMIUM_POINTS).map((k) => {
  const [f, m] = k.split("-").map(Number);
  return { fatherAge: f, motherAge: m };
});
