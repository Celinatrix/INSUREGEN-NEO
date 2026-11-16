// Kiểm tra bản ghi theo schema của dataset: kiểu, bắt buộc, miền giá trị, xác suất, tiền tệ,
// trùng khóa chính và toàn vẹn khóa ngoại.
import type { DatasetDef, Field, Row } from "./types.ts";

export type Issue = { row: number; field?: string; code: string; message: string };

const isNum = (v: unknown) => typeof v === "number" && Number.isFinite(v);

function checkField(f: Field, v: unknown): string | null {
  if (v === null || v === undefined || v === "") return f.required ? "required" : null;
  switch (f.type) {
    case "integer":
      if (!(isNum(v) && Number.isInteger(v))) return "not_integer";
      break;
    case "numeric":
    case "money":
      if (!isNum(v)) return "not_number";
      break;
    case "probability":
      if (!isNum(v)) return "not_number";
      if ((v as number) < 0 || (v as number) > 1) return "probability_out_of_range";
      break;
    case "rate":
      if (!isNum(v)) return "not_number";
      if ((v as number) < -1 || (v as number) > 10) return "rate_out_of_range";
      break;
    case "currency":
      if (typeof v !== "string" || !/^[A-Z]{3}$/.test(v)) return "not_currency";
      break;
    case "date":
      if (typeof v !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(v) || Number.isNaN(Date.parse(v))) return "not_date";
      break;
    case "timestamp":
      if (typeof v !== "string" || Number.isNaN(Date.parse(v))) return "not_timestamp";
      break;
    case "boolean":
      if (typeof v !== "boolean") return "not_boolean";
      break;
    case "text":
      if (typeof v !== "string") return "not_text";
      break;
    case "json":
      if (typeof v !== "object") return "not_json";
      break;
  }
  if (f.allowed && !f.allowed.includes(String(v))) return "not_allowed";
  if (f.min !== undefined && isNum(v) && (v as number) < f.min) return "below_min";
  if (f.max !== undefined && isNum(v) && (v as number) > f.max) return "above_max";
  return null;
}

export const keyOf = (row: Row, fields: string[]) => JSON.stringify(fields.map((k) => row[k] ?? null));

export function validateRows(def: DatasetDef, rows: Row[], lookup: (id: DatasetDef["id"]) => Row[]): Issue[] {
  const issues: Issue[] = [];
  const known = new Set(def.fields.map((f) => f.name).concat(["data_quality", "record_version", "created_at", "updated_at"]));
  const seen = new Map<string, number>();
  const hasMoney = def.fields.some((f) => f.type === "money");
  const refKeys = new Map(def.foreignKeys.map((k) => [k, new Set(lookup(k.references.dataset).map((r) => keyOf(r, k.references.fields)))]));

  rows.forEach((row, i) => {
    for (const name of Object.keys(row)) if (!known.has(name)) issues.push({ row: i, field: name, code: "unknown_field", message: `${name} is not in the ${def.id} schema` });
    for (const f of def.fields) {
      const code = checkField(f, row[f.name]);
      if (code) issues.push({ row: i, field: f.name, code, message: `${f.name}: ${code}` });
    }
    if (hasMoney && def.fields.some((f) => f.type === "money" && row[f.name] !== null && row[f.name] !== undefined) && !row.currency) {
      issues.push({ row: i, field: "currency", code: "money_without_currency", message: "money values need an explicit currency" });
    }
    const pk = keyOf(row, def.primaryKey);
    if (seen.has(pk)) issues.push({ row: i, code: "duplicate_key", message: `duplicate primary key ${pk} (also row ${seen.get(pk)})` });
    else seen.set(pk, i);
    for (const [k, set] of refKeys) {
      if (k.fields.every((x) => row[x] === null || row[x] === undefined)) continue;
      if (!set.has(keyOf(row, k.fields))) {
        issues.push({ row: i, field: k.fields.join(","), code: "foreign_key", message: `${k.fields.join(",")} not found in ${k.references.dataset}` });
      }
    }
    if (row.data_quality !== undefined && !["verified", "transcribed", "report", "computed", "operational", "missing", "synthetic"].includes(String(row.data_quality))) {
      issues.push({ row: i, field: "data_quality", code: "not_allowed", message: "unknown data_quality" });
    }
  });
  return issues;
}
