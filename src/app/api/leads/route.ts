import { CITIES, CONSENT_VERSION, normalizePhone, validateLead, type LeadInput } from "@/lib/lead";
import { getStore } from "@/lib/server/store";
import { rateLimited } from "@/lib/server/rateLimit";
import { rejectJsonWrite } from "@/lib/security";

export async function POST(request: Request) {
  const bad = rejectJsonWrite(request);
  if (bad) return bad;
  if (rateLimited(request, "leads", 5, 10 * 60_000)) {
    return Response.json({ error: "rate_limited" }, { status: 429 });
  }
  let body: LeadInput;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }
  // Bẫy bot: trường ẩn phải để trống. Trả về thành công để bot không thử lại.
  if (body.website) return Response.json({ ok: true });

  const input: LeadInput = {
    name: String(body.name ?? "").trim(),
    phone: String(body.phone ?? ""),
    email: String(body.email ?? "").trim(),
    fatherAge: body.fatherAge ?? null,
    motherAge: body.motherAge ?? null,
    youngestChildAge: body.youngestChildAge ?? null,
    city: (CITIES as readonly string[]).includes(body.city) ? body.city : "other",
    consent: body.consent === true,
    locale: body.locale === "en" ? "en" : "vi",
  };
  const errors = validateLead(input);
  if (errors.length) return Response.json({ errors }, { status: 422 });

  try {
    await getStore().insertLead({
      name: input.name,
      phone: normalizePhone(input.phone),
      email: input.email ? input.email.toLowerCase() : null,
      father_age: input.fatherAge,
      mother_age: input.motherAge,
      youngest_child_age: input.youngestChildAge,
      city: input.city,
      locale: input.locale,
      consent_version: CONSENT_VERSION,
      consent_at: new Date().toISOString(),
    });
  } catch (e) {
    console.error("[leads] insert failed", (e as Error).message);
    return Response.json({ error: "storage_failed" }, { status: 500 });
  }
  return Response.json({ ok: true }, { status: 201 });
}
