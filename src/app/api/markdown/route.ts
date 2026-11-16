// Đích nội bộ của proxy khi client gửi Accept: text/markdown cho một trang (/vi/..., /en/...).
// URL trên thanh địa chỉ không đổi; proxy truyền đường dẫn gốc qua header x-markdown-path.
import type { NextRequest } from "next/server";
import { MARKDOWN_HEADERS, markdownFor } from "@/lib/agent/response";

export function GET(request: NextRequest) {
  const path = request.headers.get("x-markdown-path") ?? "/";
  const { status, body } = markdownFor(path.startsWith("/") ? path : `/${path}`, request.nextUrl.origin);
  return new Response(body, { status, headers: MARKDOWN_HEADERS });
}

export const HEAD = GET;
