import type { NextRequest } from "next/server";
import { ILLUSTRATED_PAIRS, quote, validateQuote } from "@/lib/pricing";

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const input = {
    fatherAge: Number(sp.get("father")),
    motherAge: Number(sp.get("mother")),
    youngestChildAge: Number(sp.get("child")),
  };
  const err = validateQuote(input);
  if (err) return Response.json(err, { status: 422 });
  return Response.json(
    { ...quote(input), illustratedPairs: ILLUSTRATED_PAIRS },
    { headers: { "Cache-Control": "public, max-age=300" } },
  );
}
