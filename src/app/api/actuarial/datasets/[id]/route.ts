// GET  /api/actuarial/datasets/DB01[?format=csv|json][&validate=1] — schema và bản ghi; tải CSV/JSON.
// POST /api/actuarial/datasets/DB01 — import CSV hoặc JSON (thay toàn bộ, chỉ nhận khi hợp lệ). Chỉ bật khi chạy trên máy.
import type { NextRequest } from "next/server";
import { DATASET_BY_ID } from "@/lib/actuarial-db/registry";
import { WRITES_ENABLED, store, summary } from "@/lib/actuarial-db/server";
import { fromCsv, fromJson, toCsv } from "@/lib/actuarial-db/io";
import { RECALC_TRIGGERS, recalculate } from "@/lib/actuarial-db/run";
import { rateLimited } from "@/lib/server/rateLimit";
import type { DatasetId } from "@/lib/actuarial-db/types";

const MAX_IMPORT_BYTES = 2_000_000;

export async function GET(request: NextRequest, { params }: RouteContext<"/api/actuarial/datasets/[id]">) {
  const { id } = await params;
  const def = DATASET_BY_ID.get(id as DatasetId);
  if (!def) return Response.json({ error: "unknown_dataset" }, { status: 404 });
  const s = store();
  const rows = s.rows(def.id);
  const format = request.nextUrl.searchParams.get("format");
  if (format === "csv") {
    return new Response(toCsv(def, rows), {
      headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="${def.id}_${def.table}.csv"` },
    });
  }
  if (format === "json") {
    return new Response(JSON.stringify(rows, null, 2), {
      headers: { "Content-Type": "application/json; charset=utf-8", "Content-Disposition": `attachment; filename="${def.id}_${def.table}.json"` },
    });
  }
  const issues = request.nextUrl.searchParams.get("validate") ? s.validate(def.id, rows) : undefined;
  return Response.json({ dataset: summary(s, def), schema: { fields: def.fields, primaryKey: def.primaryKey, foreignKeys: def.foreignKeys, validation: def.validation }, rows: rows.slice(0, 500), totalRows: rows.length, issues, writesEnabled: WRITES_ENABLED });
}

export async function POST(request: NextRequest, { params }: RouteContext<"/api/actuarial/datasets/[id]">) {
  if (!WRITES_ENABLED) return Response.json({ error: "read_only" }, { status: 403 });
  if (rateLimited(request, "actuarial-import", 20, 60_000)) return Response.json({ error: "rate" }, { status: 429 });
  const { id } = await params;
  const def = DATASET_BY_ID.get(id as DatasetId);
  if (!def) return Response.json({ error: "unknown_dataset" }, { status: 404 });
  if (def.quality === "computed") return Response.json({ error: "computed_dataset_is_engine_owned" }, { status: 409 });
  const text = await request.text();
  if (text.length > MAX_IMPORT_BYTES) return Response.json({ error: "too_large" }, { status: 413 });
  const type = request.headers.get("content-type") ?? "";
  let rows;
  try {
    rows = type.includes("csv") ? fromCsv(def, text) : fromJson(text);
  } catch {
    return Response.json({ error: "unparseable" }, { status: 400 });
  }
  const s = store();
  const result = s.replace(def.id, rows, { user: "local-admin", format: type.includes("csv") ? "csv" : "json" });
  // Dữ liệu đầu vào của engine đổi thì tính lại ngay mọi kết quả phụ thuộc.
  const recalculated = result.ok && RECALC_TRIGGERS.has(def.id) ? recalculate(s) : null;
  return Response.json({ ok: result.ok, version: result.version, issues: result.issues.slice(0, 200), recalculated }, { status: result.ok ? 200 : 422 });
}
