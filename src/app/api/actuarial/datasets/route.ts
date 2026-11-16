// GET /api/actuarial/datasets — danh sách 73 dataset với số bản ghi, trạng thái, nguồn, phiên bản.
import { DATASETS } from "@/lib/actuarial-db/registry";
import { WRITES_ENABLED, store, summary } from "@/lib/actuarial-db/server";

export function GET() {
  const s = store();
  return Response.json({
    count: DATASETS.length,
    writesEnabled: WRITES_ENABLED,
    datasets: DATASETS.map((d) => summary(s, d)),
    imports: s.imports.slice(0, 50),
  });
}
