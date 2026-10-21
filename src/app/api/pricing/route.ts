import type { NextRequest } from "next/server";
import {
  STANDARD_UW,
  affordability,
  illustrate,
  loadedLife,
  quote,
  validateQuote,
  type Occupation,
  type Underwriting,
} from "@/lib/pricing";
import { ELIGIBILITY } from "@/lib/product";

const occ = (v: string | null): Occupation => (["1", "2", "3", "4"].includes(v ?? "") ? (Number(v) as Occupation) : 1);

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const input = {
    fatherAge: Number(sp.get("father")),
    motherAge: Number(sp.get("mother")),
    youngestChildAge: Number(sp.get("child")),
  };
  const err = validateQuote(input);
  if (err) return Response.json(err, { status: 422 });

  const smoker = sp.get("smoker");
  const uw: Underwriting = {
    smoker: smoker === "father" || smoker === "mother" || smoker === "both" ? smoker : STANDARD_UW.smoker,
    fatherOccupation: occ(sp.get("occF")),
    motherOccupation: occ(sp.get("occM")),
  };
  const incomeRaw = Number(sp.get("income"));
  const income = Number.isFinite(incomeRaw) && incomeRaw > 0 ? Math.min(incomeRaw, 1e12) : ELIGIBILITY.benchmarkIncome;

  const q = quote(input);
  const [lifeLow, lifeHigh] = loadedLife(q.life, uw);
  const totalLow = lifeLow + q.rider;
  const totalHigh = lifeHigh + q.rider;
  const rows = illustrate(input, uw);

  return Response.json(
    {
      ...q,
      underwriting: uw,
      lifeLow,
      lifeHigh,
      totalLow,
      totalHigh,
      loaded: lifeHigh !== q.life,
      affordability: affordability(totalLow, totalHigh, income),
      incomeProvided: sp.has("income"),
      illustration: rows,
      tenYearLow: rows[rows.length - 1].cumulativeLow,
      tenYearHigh: rows[rows.length - 1].cumulativeHigh,
    },
    { headers: { "Cache-Control": "public, max-age=300" } },
  );
}
