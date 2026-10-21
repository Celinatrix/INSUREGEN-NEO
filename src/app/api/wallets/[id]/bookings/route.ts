import type { NextRequest } from "next/server";
import { book, isUuid } from "@/lib/server/wallet";
import { rateLimited } from "@/lib/server/rateLimit";
import { rejectJsonWrite } from "@/lib/security";

export async function POST(request: NextRequest, ctx: RouteContext<"/api/wallets/[id]/bookings">) {
  const bad = rejectJsonWrite(request);
  if (bad) return bad;
  const { id } = await ctx.params;
  if (!isUuid(id)) return Response.json({ error: "not_found" }, { status: 404 });
  if (rateLimited(request, "bookings", 120, 60 * 60_000)) {
    return Response.json({ error: "rate_limited" }, { status: 429 });
  }
  const b = await request.json().catch(() => ({}));
  try {
    const out = await book(id, String(b.service), Number(b.serviceHours), String(b.serviceDate));
    if (!out) return Response.json({ error: "not_found" }, { status: 404 });
    if ("error" in out) return Response.json(out, { status: out.error === "conflict" ? 409 : 422 });
    return Response.json(out, { status: 201 });
  } catch (e) {
    console.error("[bookings] failed", (e as Error).message);
    return Response.json({ error: "storage_failed" }, { status: 500 });
  }
}
