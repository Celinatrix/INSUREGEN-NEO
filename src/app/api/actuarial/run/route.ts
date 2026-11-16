// POST /api/actuarial/run — Pricing Workbench: chạy engine thật trên dataset hiện hành với các giá trị ghi đè.
import type { NextRequest } from "next/server";
import { store } from "@/lib/actuarial-db/server";
import { run, type Overrides } from "@/lib/actuarial-db/run";
import { rateLimited } from "@/lib/server/rateLimit";

const LIMITS: Record<string, [number, number]> = {
  sumAssured: [100_000_000, 20_000_000_000],
  termYears: [1, 10],
  pricingRate: [-0.02, 0.2],
  valuationRate: [-0.02, 0.2],
  tpdUplift: [0, 5],
  mortalityMultiplier: [0, 5],
  tpdMultiplier: [0, 5],
  claimHandling: [0, 0.5],
  reinsurance: [0, 0.5],
  riskMargin: [0, 0.5],
  profit: [0, 0.5],
  adminPerYear: [0, 10_000_000],
  acquisition: [0, 100_000_000],
  cededShare: [0, 1],
};

function parse(body: unknown): { fatherAge: number; motherAge: number; overrides: Overrides } | string {
  if (!body || typeof body !== "object") return "invalid_body";
  const b = body as Record<string, unknown>;
  const fatherAge = Number(b.fatherAge);
  const motherAge = Number(b.motherAge);
  if (![fatherAge, motherAge].every((a) => Number.isInteger(a) && a >= 20 && a <= 49)) return "age_out_of_table";
  const overrides: Record<string, unknown> = {};
  const raw = (b.overrides ?? {}) as Record<string, unknown>;
  for (const [k, [lo, hi]] of Object.entries(LIMITS)) {
    if (raw[k] === undefined || raw[k] === null || raw[k] === "") continue;
    const v = Number(raw[k]);
    if (!Number.isFinite(v) || v < lo || v > hi) return `invalid_${k}`;
    overrides[k] = k === "termYears" ? Math.round(v) : v;
  }
  if (Array.isArray(raw.commission)) {
    const c = raw.commission.map(Number);
    if (c.length !== 3 || !c.every((x) => Number.isFinite(x) && x >= 0 && x <= 1)) return "invalid_commission";
    overrides.commission = c;
  }
  if (raw.dependenceShare !== undefined && raw.dependenceShare !== "") {
    const s = Number(raw.dependenceShare);
    if (!(s >= 0 && s <= 1)) return "invalid_dependenceShare";
    overrides.dependence = { model: s > 0 ? "common_shock" : "independent", share: s };
  }
  return { fatherAge, motherAge, overrides: overrides as Overrides };
}

export async function POST(request: NextRequest) {
  if (rateLimited(request, "actuarial-run", 30, 60_000)) return Response.json({ error: "rate" }, { status: 429 });
  const parsed = parse(await request.json().catch(() => null));
  if (typeof parsed === "string") return Response.json({ error: parsed }, { status: 422 });
  try {
    const result = run(store(), { ...parsed, user: "workbench", kind: "workbench" });
    return Response.json(result);
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 422 });
  }
}
