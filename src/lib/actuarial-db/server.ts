// Truy cập kho actuarial phía máy chủ và tóm tắt dataset cho Database Center.
import { DATASETS, GROUPS } from "./registry.ts";
import { actuarialStore } from "./store.ts";
import { bootstrap } from "./run.ts";
import type { DatasetDef } from "./types.ts";
import type { ActuarialStore } from "./store.ts";

export function store(): ActuarialStore {
  const s = actuarialStore();
  bootstrap(s);
  return s;
}

/** Sửa / import dữ liệu chỉ bật khi chạy trên máy (chưa có đăng nhập và phân quyền). */
export const WRITES_ENABLED = process.env.NODE_ENV !== "production" || process.env.ACTUARIAL_WRITES === "enabled";

/** Điểm chất lượng 0–100 cho từng mức nguồn dữ liệu. */
export const QUALITY_SCORE: Record<DatasetDef["quality"], number> = {
  verified: 100, report: 90, computed: 90, transcribed: 75, operational: 50, missing: 0, synthetic: 0,
};

export function summary(s: ActuarialStore, def: DatasetDef) {
  const records = s.rows(def.id).length;
  const status = def.quality === "missing" ? "source_missing" : def.quality === "operational" ? (records ? "operational" : "awaiting_operations") : records ? "populated" : "empty";
  return {
    id: def.id, table: def.table, name: def.name, group: def.group, groupName: GROUPS[def.group], description: def.description,
    records, status, quality: def.quality, qualityScore: QUALITY_SCORE[def.quality], version: s.version(def.id), updatedAt: s.updatedAt(def.id),
    source: def.source, usedBy: def.usedBy,
    references: def.foreignKeys.map((k) => k.references.dataset),
    referencedBy: DATASETS.filter((x) => x.foreignKeys.some((k) => k.references.dataset === def.id)).map((x) => x.id),
  };
}
