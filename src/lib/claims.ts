// Đánh giá một hồ sơ bồi thường Family Continuity Rider — hàm thuần.
import { RIDER, childBandFor, type ChildBand, type Service } from "./product.ts";
import {
  capToAnnualLimit,
  cisScore,
  hospitalCash,
  pathwayAHours,
  pathwayBHours,
  unlockedServices,
  type Ratings,
} from "./rules.ts";

export type Parent = "father" | "mother";
export type Reason = "illness" | "injury" | "pregnancy";

export type ClaimInput =
  | {
      parent: Parent;
      pathway: "A";
      reason: Reason;
      admissionDate: string; // YYYY-MM-DD
      dischargeDate: string;
      icuHours?: number;
    }
  | {
      parent: Parent;
      pathway: "B";
      reason: Reason;
      youngestChildAge: number;
      ratings: Ratings;
      restrictedDays: number;
    };

export type PriorClaim = {
  parent: Parent;
  pathway: "A" | "B";
  status: ClaimStatus;
  admissionDate?: string | null;
  dischargeDate?: string | null;
  hoursAwarded: number;
  cashDays: number;
};

export type ClaimStatus = "approved" | "review" | "rejected";

export type ClaimResult = {
  status: ClaimStatus;
  reasons: string[]; // mã lý do, hiển thị qua từ điển
  flags: string[]; // điểm bất thường cần chuyên viên xem xét
  inpatientDays: number | null;
  childBand: ChildBand | null;
  cisScore: number | null;
  hoursEligible: number; // trước khi trừ hạn mức năm
  hoursAwarded: number;
  cashDays: number;
  cashAmount: number;
  services: Service[];
};

const DAY = 86_400_000;
const LONG_STAY_DAYS = 60;

function parseDate(s: string): number | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
  const t = Date.parse(`${s}T00:00:00Z`);
  return Number.isNaN(t) ? null : t;
}

/** Số ngày nằm viện = số đêm giữa ngày nhập và ngày ra, tối thiểu 1. */
export function inpatientDays(admission: string, discharge: string): number | null {
  const a = parseDate(admission);
  const b = parseDate(discharge);
  if (a === null || b === null || b < a) return null;
  return Math.max(1, Math.round((b - a) / DAY));
}

export function evaluateClaim(input: ClaimInput, prior: PriorClaim[], today: string): ClaimResult {
  const sameParent = prior.filter((p) => p.parent === input.parent && p.status !== "rejected");
  const grantedThisYear = sameParent.reduce((s, p) => s + p.hoursAwarded, 0);
  const cashDaysThisYear = sameParent.reduce((s, p) => s + p.cashDays, 0);
  const base: ClaimResult = {
    status: "approved",
    reasons: [],
    flags: [],
    inpatientDays: null,
    childBand: null,
    cisScore: null,
    hoursEligible: 0,
    hoursAwarded: 0,
    cashDays: 0,
    cashAmount: 0,
    services: [],
  };

  if (input.reason === "pregnancy") {
    return { ...base, status: "rejected", reasons: ["pregnancy_excluded"] };
  }

  if (input.pathway === "A") {
    const days = inpatientDays(input.admissionDate, input.dischargeDate);
    if (days === null) return { ...base, status: "rejected", reasons: ["dates_invalid"] };
    const todayT = parseDate(today) ?? Date.now();
    const flags: string[] = [];
    if ((parseDate(input.dischargeDate) ?? 0) > todayT) flags.push("future_date");
    if (days > LONG_STAY_DAYS) flags.push("stay_unusually_long");
    const a = parseDate(input.admissionDate)!;
    const b = parseDate(input.dischargeDate)!;
    const overlaps = sameParent.some((p) => {
      if (p.pathway !== "A" || !p.admissionDate || !p.dischargeDate) return false;
      const pa = parseDate(p.admissionDate)!;
      const pb = parseDate(p.dischargeDate)!;
      return a < pb && pa < b;
    });
    if (overlaps) flags.push("overlap");

    const eligible = pathwayAHours(days, input.icuHours ?? 0);
    const hours = capToAnnualLimit(eligible, grantedThisYear);
    const cash = hospitalCash(days, cashDaysThisYear);
    const reasons: string[] = [];
    if (eligible === 0) reasons.push("stay_too_short");
    else if (hours < eligible) reasons.push("annual_limit_reached");
    return {
      ...base,
      status: flags.length ? "review" : "approved",
      reasons,
      flags,
      inpatientDays: days,
      hoursEligible: eligible,
      hoursAwarded: flags.length ? 0 : hours,
      cashDays: flags.length ? 0 : cash.paidDays,
      cashAmount: flags.length ? 0 : cash.amount,
      services: unlockedServices("A"),
    };
  }

  // Lộ trình B
  const band = childBandFor(input.youngestChildAge);
  const score = cisScore(band, input.ratings);
  const reasons: string[] = [];
  const hasRestriction = Object.values(input.ratings).some((r) => r === "F2" || r === "F3");
  if (!hasRestriction) reasons.push("no_restriction");
  else if (input.restrictedDays < RIDER.pathwayBMinConsecutiveDays) reasons.push("restriction_too_short");
  else if (score < 0.2) reasons.push("score_below_min");
  const eligible =
    reasons.length === 0 ? pathwayBHours(score, input.ratings) : 0;
  const hours = capToAnnualLimit(eligible, grantedThisYear);
  if (eligible > 0 && hours < eligible) reasons.push("annual_limit_reached");
  return {
    ...base,
    status: eligible === 0 ? "rejected" : "approved",
    reasons,
    childBand: band,
    cisScore: score,
    hoursEligible: eligible,
    hoursAwarded: hours,
    services: unlockedServices("B", input.ratings),
  };
}
