// Kho dữ liệu cho 73 dataset: bản ghi, phiên bản và lịch sử để tái lập phép tính cũ.
// Chạy trong bộ nhớ máy chủ (giống ví dùng thử khi chưa nối Supabase); bảng Postgres tương ứng
// có trong supabase/migrations/004_actuarial_datasets.sql.
import { DATASETS, DATASET_BY_ID } from "./registry.ts";
import { seedRows } from "./seed.ts";
import { validateRows, type Issue } from "./validate.ts";
import type { DatasetDef, DatasetId, Row } from "./types.ts";

type Entry = { rows: Row[]; revision: number; updatedAt: string; history: Map<number, Row[]> };
export type ImportRecord = { at: string; dataset: DatasetId; format: string; rows: number; accepted: boolean; issues: number; user: string };

export class ActuarialStore {
  private data = new Map<DatasetId, Entry>();
  readonly imports: ImportRecord[] = [];

  constructor(seed: Partial<Record<DatasetId, Row[]>> = seedRows()) {
    const now = new Date().toISOString();
    for (const def of DATASETS) {
      const rows = (seed[def.id] ?? []).map((r) => ({ ...r }));
      this.data.set(def.id, { rows, revision: 1, updatedAt: now, history: new Map([[1, rows]]) });
    }
  }

  def(id: DatasetId): DatasetDef {
    const d = DATASET_BY_ID.get(id);
    if (!d) throw new Error(`unknown_dataset_${id}`);
    return d;
  }

  rows(id: DatasetId, revision?: number): Row[] {
    const e = this.entry(id);
    if (revision === undefined || revision === e.revision) return e.rows;
    const old = e.history.get(revision);
    if (!old) throw new Error(`revision_not_found_${id}_${revision}`);
    return old;
  }

  /** Phiên bản hiển thị: phiên bản schema + số lần dữ liệu thay đổi, vd "1.0.0+r3". */
  version(id: DatasetId): string {
    return `${this.def(id).version}+r${this.entry(id).revision}`;
  }

  revision(id: DatasetId): number {
    return this.entry(id).revision;
  }

  updatedAt(id: DatasetId): string {
    return this.entry(id).updatedAt;
  }

  validate(id: DatasetId, rows: Row[]): Issue[] {
    return validateRows(this.def(id), rows, (ref) => (ref === id ? rows : this.rows(ref)));
  }

  /**
   * Thay toàn bộ bản ghi của dataset (import hoặc engine ghi kết quả). Chỉ nhận khi không có lỗi kiểm tra.
   * Bản cũ được giữ trong lịch sử để tái lập các phép tính đã chạy.
   */
  replace(id: DatasetId, rows: Row[], meta: { user: string; format: string; skipHistory?: boolean } = { user: "system", format: "engine" }): { ok: boolean; issues: Issue[]; version: string } {
    const issues = this.validate(id, rows);
    const accepted = issues.length === 0;
    if (meta.format !== "engine") {
      this.imports.unshift({ at: new Date().toISOString(), dataset: id, format: meta.format, rows: rows.length, accepted, issues: issues.length, user: meta.user });
    }
    if (!accepted) return { ok: false, issues, version: this.version(id) };
    const e = this.entry(id);
    e.revision += 1;
    e.rows = rows.map((r) => ({ ...r }));
    e.updatedAt = new Date().toISOString();
    if (!meta.skipHistory) e.history.set(e.revision, e.rows);
    return { ok: true, issues, version: this.version(id) };
  }

  /** Thêm bản ghi kết quả của một lần tính (dataset tính toán) — không đi qua import. */
  append(id: DatasetId, rows: Row[]): void {
    const e = this.entry(id);
    e.rows = e.rows.concat(rows);
    e.updatedAt = new Date().toISOString();
  }

  /** Bỏ bản ghi kết quả của các lần tính cũ để giới hạn bộ nhớ; nhật ký DB73 được giữ nguyên. */
  prune(id: DatasetId, keepRunIds: Set<string>): void {
    const e = this.entry(id);
    e.rows = e.rows.filter((r) => typeof r.run_id !== "string" || keepRunIds.has(r.run_id));
  }

  private entry(id: DatasetId): Entry {
    const e = this.data.get(id);
    if (!e) throw new Error(`unknown_dataset_${id}`);
    return e;
  }
}

const g = globalThis as unknown as { __frActuarialStore?: ActuarialStore };
/** Kho dùng chung trong một tiến trình máy chủ. */
export function actuarialStore(): ActuarialStore {
  if (!g.__frActuarialStore) g.__frActuarialStore = new ActuarialStore();
  return g.__frActuarialStore;
}
