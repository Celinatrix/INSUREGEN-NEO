// /llms.txt theo định dạng llmstxt.org: H1 tên dự án, blockquote tóm tắt, đoạn chi tiết,
// rồi các mục H2 chứa danh sách liên kết "- [tên](url): ghi chú". Mục "Optional" có thể bỏ qua khi ngữ cảnh ngắn.
import { getDict, vnd, vndShort } from "../../i18n/index.ts";
import { ELIGIBILITY, LIFE, RIDER } from "../product.ts";
import { PAGE_PATHS } from "./markdown.ts";
import { LEGAL } from "../../i18n/legal.ts";

export function llmsTxt(origin: string): string {
  const en = getDict("en");
  const page = (p: string, lang: "en" | "vi" = "en") => `${origin}/${lang}${p ? `/${p}` : ""}`;
  const legal = PAGE_PATHS.filter((p) => p in LEGAL.en) as (keyof typeof LEGAL.en)[];

  return `# Family Reconnect

> Family Reconnect is a concept insurance product by student team INSUREGEN NEO for the InsuNovate 2026 academic competition. It combines ${vndShort("en", LIFE.sumAssured)} of ${LIFE.termYears}-year joint life cover for both parents with an annual Family Continuity Rider that pays hospital cash and grants Care Hours for childcare, meals, housekeeping and escorted school runs. It is not licensed or on sale, and every figure on the site is illustrative.

The site is bilingual: Vietnamese under /vi and English under /en. Every page listed here also returns Markdown when requested with the header \`Accept: text/markdown\`.

Key product rules (from the team's final report, 19 October 2026):

- Base policy: ${vndShort("en", LIFE.sumAssured)} paid once on the first death or total and permanent disability (${LIFE.tpdThresholdPct}% or more) of either parent; ${LIFE.termYears}-year term; level life premium.
- Rider: ${vnd("en", RIDER.hospitalCashPerDay)} per inpatient day (up to ${RIDER.hospitalCashMaxDaysPerParentYear} days per parent a year) and up to ${RIDER.careHoursPerParentYear} Care Hours per parent a year, shared by Pathway A (hospital stay) and Pathway B (home recovery scored by the Caregiving Impact Score).
- Eligibility: both parents aged ${ELIGIBILITY.parentAgeMin}–${ELIGIBILITY.parentAgeMax}, youngest child under 12, net household income from ${vndShort("en", ELIGIBILITY.minNetIncome)} a year, total premium at most ${ELIGIBILITY.premiumIncomeCap * 100}% of income.

## When to use

Use this site when a user or task needs:

- The benefits, eligibility, exclusions or claims flow of Family Reconnect, or an example of an insurance design that pairs life cover with arranged household care (Care Hours) rather than cash only.
- An illustrative premium for a family: life premium by both parents' ages plus the rider premium by the older parent's age band and the youngest child's age band. Read the tables on the pricing page or call the pricing API below.
- How Pathway B awards Care Hours: the Caregiving Impact Score weights six caregiving activities by the youngest child's age.
- The actuarial basis: CSO 1980 mortality, SOA TPD tables × 1.2, 4.5% pricing interest, loadings and reserves.

Do not use it for real quotes, purchases, claims or medical or financial advice: the product is a competition concept, not offered for sale, and figures are illustrative.

How to call it:

- Pages: \`GET\` any URL below with \`Accept: text/markdown\` for Markdown, or without it for HTML.
- Pricing API: \`GET ${origin}/api/pricing?father=34&mother=30&child=3\` returns JSON with the illustrative life and rider premiums. Optional parameters: \`smoker\` (father, mother or both) and \`occF\`, \`occM\` (occupation class 1–4). Affordability in the response uses the VND 281.5 million urban benchmark income; the API does not take income, so financial data stays out of URLs.

## Pages

- [${en.meta.title}](${page("")}): the product, benefits, services, claims flow, exclusions and FAQ
- [${en.pricing.title}](${page("tinh-phi")}): illustrative premiums, rider tariff and underwriting loadings
- [${en.cisPage.title}](${page("cis")}): Caregiving Impact Score weights and Care Hour bands
- [${en.basis.title}](${page("co-so-dinh-phi")}): pricing method, assumptions and sources

## Optional

- [${en.demo.title}](${page("vi-cham-soc")}): interactive demo wallet (needs a browser; data is temporary)
${legal.map((p) => `- [${LEGAL.en[p].title}](${page(p)}): ${LEGAL.en[p].description}`).join("\n")}
- [Trang chủ tiếng Việt](${page("", "vi")}): Vietnamese home page
- [Sitemap](${origin}/sitemap.xml): every page in both languages
`;
}
