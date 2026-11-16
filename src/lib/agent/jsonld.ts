// JSON-LD (schema.org) cho trang chủ: tổ chức tác giả, website và sản phẩm.
// Không khai báo giá bán hay đánh giá: sản phẩm là ý tưởng cho cuộc thi, chưa được chào bán.
import { getDict, type Locale } from "../../i18n/index.ts";
import { LIFE } from "../product.ts";

/** Thuật ngữ sản phẩm; mỗi từ đều xuất hiện trong nội dung trang chủ cùng ngôn ngữ. */
export const PRODUCT_KEYWORDS: Record<Locale, string[]> = {
  en: ["joint life cover", "hospital cash", "Care Hours", "Family Care Wallet", "Family Continuity Rider"],
  vi: ["bảo hiểm nhân thọ chung", "trợ cấp nằm viện", "Giờ chăm sóc", "Ví Chăm sóc Gia đình", "Family Continuity Rider"],
};

export function homeJsonLd(lang: Locale, origin: string) {
  const d = getDict(lang);
  const url = `${origin}/${lang}`;
  const org = `${origin}/#insuregen-neo`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": org,
        name: "INSUREGEN NEO",
        description:
          lang === "vi"
            ? "Đội sinh viên thiết kế Family Reconnect cho cuộc thi InsuNovate 2026."
            : "Student team that designed Family Reconnect for the InsuNovate 2026 competition.",
        url: origin,
        logo: `${origin}/logo.svg`,
      },
      {
        "@type": "WebSite",
        "@id": `${origin}/#website`,
        name: "Family Reconnect",
        url: origin,
        inLanguage: ["vi", "en"],
        publisher: { "@id": org },
      },
      {
        "@type": "FinancialProduct",
        "@id": `${url}#product`,
        name: "Family Reconnect",
        description: d.meta.description,
        url,
        category: lang === "vi" ? "Bảo hiểm nhân thọ chung kèm quyền lợi bổ trợ chăm sóc gia đình" : "Joint life insurance with a family care rider",
        serviceType: PRODUCT_KEYWORDS[lang][0],
        keywords: PRODUCT_KEYWORDS[lang].join(", "),
        provider: { "@id": org },
        areaServed: { "@type": "City", name: lang === "vi" ? "TP.HCM" : "Ho Chi Minh City" },
        termsOfService: `${url}/dieu-khoan`,
        additionalProperty: [
          { "@type": "PropertyValue", name: lang === "vi" ? "Số tiền bảo hiểm" : "Sum assured", value: LIFE.sumAssured, unitCode: "VND" },
          { "@type": "PropertyValue", name: lang === "vi" ? "Thời hạn (năm)" : "Term (years)", value: LIFE.termYears },
        ],
        disambiguatingDescription:
          lang === "vi"
            ? "Sản phẩm ý tưởng cho cuộc thi học thuật, chưa được cấp phép và chưa chào bán; mọi con số là minh họa."
            : "A concept product for an academic competition; not licensed or on sale, and all figures are illustrative.",
      },
    ],
  };
}

/** Chuỗi JSON an toàn để đặt trong <script type="application/ld+json">. */
export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026");
}
