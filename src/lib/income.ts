// Đọc thu nhập người dùng gõ (triệu đồng/năm), chịu được cả dấu chấm lẫn dấu phẩy.
// Dấu chấm hoặc phẩy chỉ là dấu nghìn khi theo sau là đúng nhóm 3 chữ số ("1.250", "1,250").
// Còn lại là dấu thập phân ("281.5", "281,5").

export const INCOME_MAX_MILLION = 100_000; // 100 tỷ đồng/năm: trên mức này gần như chắc là gõ nhầm

export type IncomeRead =
  | { kind: "empty" }
  | { kind: "invalid" }
  | { kind: "tooLarge"; million: number }
  | { kind: "ok"; million: number };

export function readIncomeMillion(raw: string): IncomeRead {
  const s = raw.replace(/\s/g, "");
  if (!s) return { kind: "empty" };
  if (!/^\d[\d.,]*$/.test(s)) return { kind: "invalid" };

  const hasDot = s.includes(".");
  const hasComma = s.includes(",");
  let normalized: string;
  if (hasDot && hasComma) {
    // Dấu đứng sau cùng là dấu thập phân: "1.250,5" hoặc "1,250.5".
    const dec = s.lastIndexOf(",") > s.lastIndexOf(".") ? "," : ".";
    const thou = dec === "," ? "." : ",";
    normalized = s.split(thou).join("").replace(dec, ".");
  } else if (hasDot || hasComma) {
    const sep = hasDot ? "." : ",";
    const grouped = new RegExp(`^\\d{1,3}(\\${sep}\\d{3})+$`).test(s);
    normalized = grouped ? s.split(sep).join("") : s.replace(sep, ".");
  } else {
    normalized = s;
  }
  if ((normalized.match(/\./g) ?? []).length > 1) return { kind: "invalid" };

  const million = Number(normalized);
  if (!Number.isFinite(million) || million <= 0) return { kind: "invalid" };
  if (million > INCOME_MAX_MILLION) return { kind: "tooLarge", million };
  return { kind: "ok", million };
}
