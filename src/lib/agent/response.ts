// Phản hồi Markdown cho một đường dẫn trang: 200 nếu trang có, 404 kèm thân Markdown nếu không.
import { hasLocale, type Locale } from "../../i18n/index.ts";
import { notFoundMarkdown, pageMarkdown } from "./markdown.ts";

export const MARKDOWN_HEADERS = {
  "Content-Type": "text/markdown; charset=utf-8",
  Vary: "Accept",
  // Giống bản HTML (động vì nonce CSP): không để CDN lưu, tránh trả nhầm Markdown cho trình duyệt.
  "Cache-Control": "private, no-store",
  "X-Content-Type-Options": "nosniff",
} as const;

export function markdownFor(pathname: string, origin: string): { status: 200 | 404; body: string } {
  const [, first = "", ...rest] = pathname.split("/");
  const lang: Locale = hasLocale(first) ? first : "en";
  const sub = rest.join("/").replace(/\/+$/, "");
  const body = hasLocale(first) ? pageMarkdown(lang, sub, origin) : null;
  return body ? { status: 200, body } : { status: 404, body: notFoundMarkdown(lang, pathname, origin) };
}
