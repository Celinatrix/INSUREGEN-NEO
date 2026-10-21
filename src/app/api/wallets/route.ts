import { createWallet, summarize, validChildAge } from "@/lib/server/wallet";
import { rateLimited } from "@/lib/server/rateLimit";
import { rejectJsonWrite } from "@/lib/security";

export async function POST(request: Request) {
  const bad = rejectJsonWrite(request);
  if (bad) return bad;
  if (rateLimited(request, "wallets", 30, 60 * 60_000)) {
    return Response.json({ error: "rate_limited" }, { status: 429 });
  }
  const body = await request.json().catch(() => ({}));
  const age = Number(body.youngestChildAge ?? 3);
  if (!validChildAge(age)) return Response.json({ error: "child_age_out_of_range" }, { status: 422 });
  try {
    return Response.json(summarize(await createWallet(age)), { status: 201 });
  } catch (e) {
    console.error("[wallets] create failed", (e as Error).message);
    return Response.json({ error: "storage_failed" }, { status: 500 });
  }
}
