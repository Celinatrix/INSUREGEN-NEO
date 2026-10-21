import type { NextRequest } from "next/server";
import { getStore } from "@/lib/server/store";
import { isUuid, summarize } from "@/lib/server/wallet";

export async function GET(_req: NextRequest, ctx: RouteContext<"/api/wallets/[id]">) {
  const { id } = await ctx.params;
  if (!isUuid(id)) return Response.json({ error: "not_found" }, { status: 404 });
  const snap = await getStore().getWallet(id);
  if (!snap) return Response.json({ error: "not_found" }, { status: 404 });
  return Response.json(summarize(snap), { headers: { "Cache-Control": "no-store" } });
}
