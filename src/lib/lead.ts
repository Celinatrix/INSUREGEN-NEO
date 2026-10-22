// Kiểm tra dữ liệu form đăng ký tư vấn — dùng chung cho trình duyệt và API.
import { ELIGIBILITY } from "./product.ts";

export type LeadInput = {
  name: string;
  phone: string;
  email: string;
  fatherAge: number | null;
  motherAge: number | null;
  youngestChildAge: number | null;
  city: string;
  consent: boolean;
  locale: string;
  website?: string; // bẫy bot, phải để trống
};

export type LeadField = "name" | "phone" | "email" | "fatherAge" | "motherAge" | "youngestChildAge" | "consent";
export type LeadError = { field: LeadField; code: string };

export const CITIES = ["hcmc", "hanoi", "danang", "other"] as const;
export const CONSENT_VERSION = "2026-10-22-pdpl-v2"; // Luật 91/2025/QH15, Nghị định 356/2025/NĐ-CP

export function normalizePhone(p: string) {
  return p.replace(/[\s.\-()]/g, "");
}

export function validateLead(x: LeadInput): LeadError[] {
  const e: LeadError[] = [];
  if (!x.name || x.name.trim().length < 2 || x.name.length > 120) e.push({ field: "name", code: "name" });
  if (!/^(0|\+84)(3|5|7|8|9)\d{8}$/.test(normalizePhone(x.phone ?? ""))) e.push({ field: "phone", code: "phone" });
  const email = (x.email ?? "").trim();
  // Email không bắt buộc (chỉ thu dữ liệu thật sự cần); nếu nhập thì phải đúng định dạng.
  if (email && (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 200)) e.push({ field: "email", code: "email" });
  const age = (v: number | null) =>
    v === null || (Number.isInteger(v) && v >= ELIGIBILITY.parentAgeMin && v <= ELIGIBILITY.parentAgeMax);
  if (!age(x.fatherAge)) e.push({ field: "fatherAge", code: "age" });
  if (!age(x.motherAge)) e.push({ field: "motherAge", code: "age" });
  const c = x.youngestChildAge;
  if (!(c === null || (Number.isInteger(c) && c >= 0 && c <= ELIGIBILITY.youngestChildMaxAtEntry))) {
    e.push({ field: "youngestChildAge", code: "child" });
  }
  if (x.consent !== true) e.push({ field: "consent", code: "consent" });
  return e;
}
