import { NextResponse, type NextRequest } from "next/server";
import { pageCsp } from "@/lib/security";
import { prefersMarkdown } from "@/lib/agent/negotiate";

const LOCALES = ["vi", "en"];

function preferred(request: NextRequest): string {
  const header = request.headers.get("accept-language") ?? "";
  const first = header.split(",")[0]?.trim().toLowerCase() ?? "";
  return first.startsWith("en") ? "en" : "vi";
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasLocale = LOCALES.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));
  if (!hasLocale) {
    const saved = request.cookies.get("fr-lang")?.value;
    const locale = saved && LOCALES.includes(saved) ? saved : preferred(request);
    request.nextUrl.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(request.nextUrl);
  }

  // Agent xin Markdown (Accept: text/markdown): trả bản Markdown của chính trang này, cùng URL.
  if (prefersMarkdown(request.headers.get("accept"))) {
    // Đường dẫn gốc đi qua header nội bộ: route đích không thấy query của URL rewrite.
    const forwarded = new Headers(request.headers);
    forwarded.set("x-markdown-path", pathname);
    return NextResponse.rewrite(new URL("/api/markdown", request.url), { request: { headers: forwarded } });
  }

  // Mỗi lượt tải trang có một nonce mới; Next.js tự gắn nonce vào script của nó.
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const csp = pageCsp(nonce, process.env.NODE_ENV === "development");
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);
  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", csp);
  // Cùng URL trả HTML hoặc Markdown tùy Accept, nên bộ nhớ đệm phải phân biệt theo Accept.
  response.headers.append("Vary", "Accept");
  return response;
}

export const config = {
  matcher: [
    {
      source: "/((?!api|_next/static|_next/image|images|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
