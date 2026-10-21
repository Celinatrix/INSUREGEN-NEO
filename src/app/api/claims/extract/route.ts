// Đọc giấy ra viện bằng Claude (thị giác): trả về ngày nhập viện, ngày ra viện, giờ ICU.
// Cần biến môi trường ANTHROPIC_API_KEY. Không có khóa → trả 501 để giao diện chuyển sang nhập tay.
// Ảnh không được lưu lại.
import { rateLimited } from "@/lib/server/rateLimit";
import { crossSite } from "@/lib/security";
import { sniffImage } from "@/lib/upload";

const MAX_BYTES = 5 * 1024 * 1024;
const TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const PROMPT = `You read Vietnamese or English hospital discharge papers (giấy ra viện).
Return ONLY a JSON object with these keys:
{"admissionDate": "YYYY-MM-DD" or null, "dischargeDate": "YYYY-MM-DD" or null, "icuHours": number or null, "hospital": string or null, "confidence": "high" | "medium" | "low"}
Vietnamese dates are day/month/year. "Vào viện" = admission, "Ra viện" = discharge, "Hồi sức tích cực"/ICU = intensive care.
Do not include the diagnosis or any other personal data. If the image is not a discharge paper, return all nulls with confidence "low".`;

type Extracted = {
  admissionDate: string | null;
  dischargeDate: string | null;
  icuHours: number | null;
  hospital: string | null;
  confidence: "high" | "medium" | "low";
};

const isDate = (s: unknown) => typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(s));

export async function POST(request: Request) {
  if (crossSite(request)) return Response.json({ error: "forbidden_origin" }, { status: 403 });
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return Response.json({ error: "extraction_unavailable" }, { status: 501 });
  if (rateLimited(request, "extract", 20, 60 * 60_000)) {
    return Response.json({ error: "rate_limited" }, { status: 429 });
  }
  // Từ chối sớm theo Content-Length để không phải đọc cả tệp quá lớn vào bộ nhớ.
  if (Number(request.headers.get("content-length") ?? 0) > MAX_BYTES + 64 * 1024) {
    return Response.json({ error: "too_large" }, { status: 413 });
  }
  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return Response.json({ error: "no_file" }, { status: 400 });
  if (!TYPES.includes(file.type)) return Response.json({ error: "unsupported_type" }, { status: 415 });
  if (file.size > MAX_BYTES) return Response.json({ error: "too_large" }, { status: 413 });

  const bytes = new Uint8Array(await file.arrayBuffer());
  const mediaType = sniffImage(bytes);
  if (!mediaType) return Response.json({ error: "unsupported_type" }, { status: 415 });
  const data = Buffer.from(bytes).toString("base64");
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL ?? "claude-sonnet-5-5",
      max_tokens: 300,
      messages: [
        {
          role: "user",
          content: [
            { type: "image", source: { type: "base64", media_type: mediaType, data } },
            { type: "text", text: PROMPT },
          ],
        },
      ],
    }),
  }).catch(() => null);

  if (!res || !res.ok) {
    console.error("[extract] API error", res?.status);
    return Response.json({ error: "extraction_failed" }, { status: 502 });
  }
  const body = await res.json();
  const text: string = body?.content?.find((c: { type: string }) => c.type === "text")?.text ?? "";
  const match = text.match(/\{[\s\S]*\}/);
  let out: Extracted;
  try {
    const j = JSON.parse(match?.[0] ?? "{}");
    out = {
      admissionDate: isDate(j.admissionDate) ? j.admissionDate : null,
      dischargeDate: isDate(j.dischargeDate) ? j.dischargeDate : null,
      icuHours: Number.isFinite(j.icuHours) && j.icuHours >= 0 ? Math.round(j.icuHours) : null,
      hospital: typeof j.hospital === "string" ? j.hospital.slice(0, 120) : null,
      confidence: ["high", "medium", "low"].includes(j.confidence) ? j.confidence : "low",
    };
  } catch {
    return Response.json({ error: "extraction_failed" }, { status: 502 });
  }
  if (!out.admissionDate || !out.dischargeDate) {
    return Response.json({ error: "not_readable", ...out }, { status: 422 });
  }
  return Response.json(out);
}
