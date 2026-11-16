// Nhập/xuất CSV (RFC 4180) và JSON cho dataset, theo kiểu trường trong schema.
import type { DatasetDef, Row } from "./types.ts";

const cell = (v: unknown): string => {
  if (v === null || v === undefined) return "";
  const s = typeof v === "object" ? JSON.stringify(v) : String(v);
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export function toCsv(def: DatasetDef, rows: Row[]): string {
  const cols = [...def.fields.map((f) => f.name), "data_quality"];
  return [cols.join(","), ...rows.map((r) => cols.map((c) => cell(c === "data_quality" ? r[c] ?? def.quality : r[c])).join(","))].join("\r\n") + "\r\n";
}

function parseCsvText(text: string): string[][] {
  const out: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (ch === '"') quoted = false;
      else field += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ",") { row.push(field); field = ""; }
    else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      row.push(field); field = "";
      if (row.some((c) => c !== "")) out.push(row);
      row = [];
    } else field += ch;
  }
  if (field !== "" || row.length) { row.push(field); if (row.some((c) => c !== "")) out.push(row); }
  return out;
}

/** Đổi chuỗi CSV về đúng kiểu theo schema; giá trị không đổi được để nguyên để bộ kiểm tra báo lỗi. */
function coerce(def: DatasetDef, name: string, raw: string): Row[string] {
  if (raw === "") return null;
  const f = def.fields.find((x) => x.name === name);
  if (!f) return raw;
  switch (f.type) {
    case "integer":
    case "numeric":
    case "probability":
    case "rate":
    case "money": {
      const n = Number(raw);
      return Number.isFinite(n) ? n : raw;
    }
    case "boolean":
      return raw === "true" ? true : raw === "false" ? false : raw;
    case "json":
      try { return JSON.parse(raw); } catch { return raw; }
    default:
      return raw;
  }
}

export function fromCsv(def: DatasetDef, text: string): Row[] {
  const [header, ...lines] = parseCsvText(text.replace(/^﻿/, ""));
  if (!header) return [];
  return lines.map((cells) => Object.fromEntries(header.map((h, i) => [h.trim(), coerce(def, h.trim(), cells[i] ?? "")])));
}

export function fromJson(text: string): Row[] {
  const data = JSON.parse(text);
  if (!Array.isArray(data)) throw new Error("json_must_be_an_array_of_rows");
  return data as Row[];
}
