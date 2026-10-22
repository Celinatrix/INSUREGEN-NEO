import type { MetadataRoute } from "next";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const PATHS = ["", "/tinh-phi", "/cis", "/vi-cham-soc", "/co-so-dinh-phi", "/chinh-sach-bao-mat", "/dieu-khoan", "/cookie", "/hoan-phi"];

export default function sitemap(): MetadataRoute.Sitemap {
  return PATHS.flatMap((p) =>
    (["vi", "en"] as const).map((l) => ({
      url: `${SITE}/${l}${p}`,
      alternates: { languages: { vi: `${SITE}/vi${p}`, en: `${SITE}/en${p}` } },
    })),
  );
}
