import type { NextRequest } from "next/server";
import { getStore } from "@/lib/server/store";
import { isUuid, parseClaim, submitClaim } from "@/lib/server/wallet";
import { rateLimited } from "@/lib/server/rateLimit";
import { rejectJsonWrite } from "@/lib/security";

export async function POST(request: NextRequest, ctx: RouteContext<"/api/wallets/[id]/claims">) {
  const bad = rejectJsonWrite(request);
  if (bad) return bad;
  const { id } = await ctx.params;
  if (!isUuid(id)) return Response.json({ error: "not_found" }, { status: 404 });
  if (rateLimited(request, "claims", 60, 60 * 60_000)) {
    return Response.json({ error: "rate_limited" }, { status: 429 });
  }
  const snap = await getStore().getWallet(id);
  if (!snap) return Response.json({ error: "not_found" }, { status: 404 });
  const input = parseClaim(await request.json().catch(() => null), snap.wallet.youngest_child_age);
  if (!input) return Response.json({ error: "invalid_claim" }, { status: 422 });
  try {
    const out = await submitClaim(id, input);
    return Response.json(out, { status: 201 });
  } catch (e) {
    console.error("[claims] failed", (e as Error).message);
    return Response.json({ error: "storage_failed" }, { status: 500 });
  }
}
