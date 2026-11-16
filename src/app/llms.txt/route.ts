// /llms.txt (llmstxt.org): mục lục Markdown cho agent, có phần "When to use".
import type { NextRequest } from "next/server";
import { llmsTxt } from "@/lib/agent/llms";

export function GET(request: NextRequest) {
  return new Response(llmsTxt(request.nextUrl.origin), {
    headers: { "Content-Type": "text/markdown; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
