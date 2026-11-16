// GET /api/actuarial/runs/RUN-… — nhật ký DB73 của một lần tính và kết quả tái lập với đúng phiên bản dữ liệu cũ.
import type { NextRequest } from "next/server";
import { store } from "@/lib/actuarial-db/server";
import { reproduce } from "@/lib/actuarial-db/run";

export async function GET(_request: NextRequest, { params }: RouteContext<"/api/actuarial/runs/[id]">) {
  const { id } = await params;
  const s = store();
  const audit = s.rows("DB73").find((r) => r.run_id === id);
  if (!audit) return Response.json({ error: "run_not_found" }, { status: 404 });
  return Response.json({ audit, reproduction: reproduce(s, id) });
}
