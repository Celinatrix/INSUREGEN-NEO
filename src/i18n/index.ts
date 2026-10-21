import vi, { type Dict } from "./vi.ts";
import en from "./en.ts";
import { LIFE, RIDER, ELIGIBILITY } from "../lib/product.ts";

export const LOCALES = ["vi", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "vi";

const dicts: Record<Locale, Dict> = { vi, en };

export const hasLocale = (l: string): l is Locale => (LOCALES as readonly string[]).includes(l);
export const getDict = (l: Locale): Dict => dicts[l];

/** Thay {key} trong chuỗi bằng giá trị. */
export function fmt(template: string, vars: Record<string, string | number> = {}): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? String(vars[k]) : `{${k}}`));
}

/** Tiền đầy đủ: 22.607.760đ / VND 22,607,760 */
export function vnd(l: Locale, v: number): string {
  const n = Math.round(v);
  return l === "vi" ? `${n.toLocaleString("vi-VN")}đ` : `VND ${n.toLocaleString("en-US")}`;
}

/** Tiền rút gọn: 2 tỷ đồng / 22,6 triệu đồng · VND 2 billion / VND 22.6 million */
export function vndShort(l: Locale, v: number): string {
  const unit = v >= 1e9 ? 1e9 : 1e6;
  const x = Math.round((v / unit) * 10) / 10;
  const num = x.toLocaleString(l === "vi" ? "vi-VN" : "en-US", { maximumFractionDigits: 1 });
  if (l === "vi") return `${num} ${unit === 1e9 ? "tỷ" : "triệu"} đồng`;
  return `VND ${num} ${unit === 1e9 ? "billion" : "million"}`;
}

export function pct(l: Locale, v: number, digits = 1): string {
  return `${(v * 100).toLocaleString(l === "vi" ? "vi-VN" : "en-US", { maximumFractionDigits: digits, minimumFractionDigits: digits })}%`;
}

/** Biến số chung dùng trong nhiều chuỗi. */
export function commonVars(l: Locale) {
  return {
    sum: vndShort(l, LIFE.sumAssured),
    cash: vnd(l, RIDER.hospitalCashPerDay),
    cashDays: RIDER.hospitalCashMaxDaysPerParentYear,
    hours: RIDER.careHoursPerParentYear,
    gift: RIDER.giftHoursPerFamilyYear,
    term: LIFE.termYears,
    tpd: LIFE.tpdThresholdPct,
    years: LIFE.waitingPeriodYears,
    minIncome: vndShort(l, ELIGIBILITY.minNetIncome),
  };
}

export type { Dict };
