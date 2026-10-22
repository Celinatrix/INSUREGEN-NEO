import type { NextRequest } from "next/server";
import { getStore } from "@/lib/server/store";
import { isUuid, summarize } from "@/lib/server/wallet";
import { crossSite } from "@/lib/security";

export async function GET(_req: NextRequest, ctx: RouteContext<"/api/wallets/[id]">) {
  const { id } = await ctx.params;
  if (!isUuid(id)) return Response.json({ error: "not_found" }, { status: 404 });
  const snap = await getStore().getWallet(id);
  if (!snap) return Response.json({ error: "not_found" }, { status: 404 });
  return Response.json(summarize(snap), { headers: { "Cache-Control": "no-store" } });
}

/** Quyền xóa dữ liệu: người dùng tự xóa ví dùng thử và mọi dữ liệu đi kèm. */
export async function DELETE(request: NextRequest, ctx: RouteContext<"/api/wallets/[id]">) {
  if (crossSite(request)) return Response.json({ error: "forbidden_origin" }, { status: 403 });
  const { id } = await ctx.params;
  if (!isUuid(id)) return Response.json({ error: "not_found" }, { status: 404 });
  try {
    const ok = await getStore().deleteWallet(id);
    return ok ? new Response(null, { status: 204 }) : Response.json({ error: "not_found" }, { status: 404 });
  } catch (e) {
    console.error("[wallets] delete failed", (e as Error).message);
    return Response.json({ error: "storage_failed" }, { status: 500 });
  }
}
