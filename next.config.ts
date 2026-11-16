import type { NextConfig } from "next";
import { API_CSP, BASE_HEADERS } from "./src/lib/security";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  async headers() {
    return [
      { source: "/:path*", headers: BASE_HEADERS },
      // Trang trả HTML hoặc Markdown tùy Accept (xem src/proxy.ts), nên bộ nhớ đệm phải phân biệt theo Accept.
      { source: "/:lang(vi|en)/:path*", headers: [{ key: "Vary", value: "Accept" }] },
      { source: "/:lang(vi|en)", headers: [{ key: "Vary", value: "Accept" }] },
      { source: "/api/:path*", headers: [{ key: "Content-Security-Policy", value: API_CSP }] },
    ];
  },
};

export default nextConfig;
