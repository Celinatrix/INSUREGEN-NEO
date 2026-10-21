// Chính sách bảo mật dùng chung cho proxy (trang) và next.config (API, tệp tĩnh).

/** CSP cho trang HTML: script chỉ chạy khi có nonce của lượt tải đó. */
export function pageCsp(nonce: string, isDev: boolean): string {
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""}`,
    // React render thuộc tính style="" nên cần 'unsafe-inline' cho style (rủi ro thấp, không chạy được mã).
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self'",
    `connect-src 'self'${isDev ? " ws:" : ""}`,
    "frame-src 'none'",
    "media-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    ...(isDev ? [] : ["upgrade-insecure-requests"]),
  ].join("; ");
}

/** CSP cho phản hồi JSON của API: không tải gì, không cho nhúng. */
export const API_CSP = "default-src 'none'; frame-ancestors 'none'";

/** Header áp cho mọi phản hồi, gồm cả tệp tĩnh. */
export const BASE_HEADERS: { key: string; value: string }[] = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
];

/**
 * Chặn request ghi dữ liệu đến từ trang web khác (CSRF).
 * Trình duyệt luôn gửi Origin với POST; nếu có Origin thì host phải trùng với host của trang.
 */
export function crossSite(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  try {
    return new URL(origin).host !== host;
  } catch {
    return true;
  }
}

/** Kiểm tra chung cho các API nhận JSON: cùng nguồn và đúng Content-Type. */
export function rejectJsonWrite(request: Request): Response | null {
  if (crossSite(request)) return Response.json({ error: "forbidden_origin" }, { status: 403 });
  const type = request.headers.get("content-type") ?? "";
  if (!type.toLowerCase().startsWith("application/json")) {
    return Response.json({ error: "unsupported_media_type" }, { status: 415 });
  }
  return null;
}
