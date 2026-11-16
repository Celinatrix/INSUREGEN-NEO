// Bản Markdown của từng trang, dựng từ cùng nội dung song ngữ (src/i18n) và số liệu (src/lib/product.ts)
// mà trang HTML dùng. Không có câu chữ riêng cho agent ngoài phần điều hướng và trang 404.
import { commonVars, fmt, getDict, vnd, vndShort, type Locale } from "../../i18n/index.ts";
import { LEGAL, LEGAL_SLUGS, type Block, type LegalSlug } from "../../i18n/legal.ts";
import {
  ACTIVITIES,
  CHILD_BANDS,
  CIS_WEIGHTS,
  LIFE_PREMIUM_POINTS,
  MARKET,
  PATHWAY_B_TIERS,
  RIDER_RATES,
} from "../product.ts";
import { hospitalCash, pathwayAHours } from "../rules.ts";

/** Đường dẫn trang (sau /vi hoặc /en) có bản Markdown; "" là trang chủ. */
export const PAGE_PATHS = ["", "tinh-phi", "cis", "vi-cham-soc", "co-so-dinh-phi", ...LEGAL_SLUGS] as const;
export type PagePath = (typeof PAGE_PATHS)[number];

// Ví dụ trong đề xuất sản phẩm (Bảng 3.4), cùng số với trang chủ.
const STORY_DAYS = 8;

const nf = (l: Locale) => (l === "vi" ? "vi-VN" : "en-US");
const num = (l: Locale, v: number) => v.toLocaleString(nf(l));
const list = (items: string[]) => items.map((s) => `- ${s}`).join("\n");
const table = (rows: string[][]) => {
  const [head, ...body] = rows;
  const line = (r: string[]) => `| ${r.map((c) => c.replace(/\|/g, "\\|")).join(" | ")} |`;
  return [line(head), line(head.map(() => "---")), ...body.map(line)].join("\n");
};

function pageTitle(lang: Locale, path: PagePath): string {
  const d = getDict(lang);
  switch (path) {
    case "":
      return d.meta.title;
    case "tinh-phi":
      return d.pricing.title;
    case "cis":
      return d.cisPage.title;
    case "vi-cham-soc":
      return d.demo.title;
    case "co-so-dinh-phi":
      return d.basis.title;
    default:
      return LEGAL[lang][path as LegalSlug].title;
  }
}

function header(lang: Locale, path: PagePath, origin: string): string {
  const other: Locale = lang === "vi" ? "en" : "vi";
  const suffix = path ? `/${path}` : "";
  const note =
    lang === "vi"
      ? `Bản Markdown của ${origin}/${lang}${suffix}. Bản tiếng Anh: ${origin}/${other}${suffix}. Mục lục cho agent: ${origin}/llms.txt`
      : `Markdown version of ${origin}/${lang}${suffix}. Vietnamese version: ${origin}/${other}${suffix}. Agent index: ${origin}/llms.txt`;
  return `# ${pageTitle(lang, path)}\n\n> ${note}`;
}

function home(lang: Locale): string {
  const d = getDict(lang);
  const v = commonVars(lang);
  const f = (s: string) => fmt(s, v);
  const story = { ...v, days: STORY_DAYS, hours: pathwayAHours(STORY_DAYS), cash: vnd(lang, hospitalCash(STORY_DAYS).amount) };
  const [lo, hi] = MARKET.childcareCostPerStay;
  const stats = [
    `${Math.round(MARKET.twoGenerationShare * 100)}%`,
    `${Math.round(MARKET.admissionProb10y * 100)}%`,
    `${num(lang, MARKET.avgStayDays)} ${d.units.days}`,
    lang === "vi" ? `${num(lang, lo / 1e6)}–${num(lang, hi / 1e6)} triệu đồng` : `VND ${num(lang, lo / 1e6)}–${num(lang, hi / 1e6)} million`,
  ];
  const tiers = PATHWAY_B_TIERS.slice().reverse();

  return [
    `${d.hero.titleA} ${d.hero.titleB}`,
    f(d.hero.lead),
    list(d.hero.facts.map(f)),

    `## ${d.problem.title}`,
    d.problem.lead,
    ...d.problem.days.map((day) => `### ${day.badge}: ${day.title}\n\n${list(day.items.map((i) => i.text))}`),
    `**${d.problem.close}**`,
    list(d.problem.stats.map((s, i) => `${stats[i]}: ${s}`)),
    `_${d.problem.source}_`,

    `## ${d.continuum.title}`,
    list([
      `**${f(d.continuum.life.title)}** (${f(d.continuum.life.kicker)}): ${f(d.continuum.life.death)} ${f(d.continuum.life.tpd)}`,
      `**Family Continuity Rider** (${f(d.continuum.rider.kicker)}): ${f(d.continuum.rider.a)} ${f(d.continuum.rider.b)} ${f(d.continuum.rider.end)}`,
      `**${d.continuum.limits.title}**: ${f(d.continuum.limits.on)}`,
    ]),

    `## ${d.wallet.title}`,
    f(d.wallet.lead),
    `### ${d.wallet.a}`,
    list([
      ...d.wallet.aTiers.map((t, i) => `${t}: ${[20, 40, 60][i]} ${d.units.hours}`),
      `${d.wallet.cashTitle}: ${v.cash}${d.units.perDay}, ${f(d.wallet.cashSub)}`,
      ...d.wallet.asideA,
    ]),
    `### ${d.wallet.b}`,
    list([...tiers.map((t, i) => `CIS ${num(lang, t.minScore)}${i < tiers.length - 1 ? `–${num(lang, tiers[i + 1].minScore)}` : "–1"}: ${t.hours} ${d.units.hours}`), ...d.wallet.asideB]),
    d.wallet.cisNote,
    d.wallet.validity,

    `## ${d.services.title}`,
    d.services.lead,
    list(
      (["childcare", "meals", "transport", "housekeeping"] as const).map(
        (k) => `**${d.services.names[k]}**: ${d.services.bullets[k].join("; ")}`,
      ),
    ),
    `${d.services.standardsLabel} ${d.services.standards.join("; ")}.`,

    `## ${d.claims.title}`,
    d.claims.lead,
    d.claims.steps.map((s, i) => `${i + 1}. **${s.t}**: ${fmt(s.d, story)}`).join("\n"),

    `## ${d.why.title}`,
    list(d.why.items.map((i) => `**${i.t}**: ${i.d}`)),

    `## ${d.trust.title}`,
    list(d.trust.excl.map((e) => `**${e.t}**: ${f(e.d)}`)),
    `_${d.trust.exclNote}_`,
    `### ${d.trust.whoTitle}`,
    list(d.trust.who.map((w) => `**${w.t}**: ${w.d}`)),
    `### ${d.trust.flowTitle}`,
    d.trust.flow.map((s, i) => `${i + 1}. **${s.t}**: ${s.d}`).join("\n"),
    list(d.trust.flows.map((s) => `**${s.t}** ${s.d}`)),

    `## ${d.faq.title}`,
    ...d.faq.items.map((q) => `### ${q.q}\n\n${f(q.a)}`),
  ].join("\n\n");
}

function pricing(lang: Locale): string {
  const d = getDict(lang);
  const p = d.pricing;
  const older = p.olderParent;
  const lifeRows = Object.entries(LIFE_PREMIUM_POINTS).map(([pair, v]) => [pair.replace("-", " / "), vnd(lang, v)]);
  return [
    p.lead,
    `_${p.disclaim}_`,
    `### ${p.riderTable}`,
    table([
      [d.pricing.child, `${older} 25–39`, `${older} 40–49`],
      ...CHILD_BANDS.map((b) => [b, vnd(lang, RIDER_RATES["25-39"][b]), vnd(lang, RIDER_RATES["40-49"][b])]),
    ]),
    `### ${p.lifeRow.replace("{sum}", vndShort(lang, 2_000_000_000))}`,
    table([[`${p.father} / ${p.mother}`, p.illus.life], ...lifeRows]),
    p.termNote,
    p.uw.note,
    p.underwriting,
  ].join("\n\n");
}

function cis(lang: Locale): string {
  const d = getDict(lang);
  const c = d.cisPage;
  return [
    c.lead,
    table([
      [d.wallet.activity, ...CHILD_BANDS.map((b) => `${d.wallet.child} ${b}`)],
      ...ACTIVITIES.map((a) => [`${a} ${d.activities[a]}`, ...CHILD_BANDS.map((b) => `${Math.round(CIS_WEIGHTS[b][a] * 100)}%`)]),
    ]),
    d.wallet.cisNote,
    list(PATHWAY_B_TIERS.slice().reverse().map((t) => `CIS ≥ ${num(lang, t.minScore)}: ${t.hours} ${d.units.hours}`)),
    c.belowMin,
    c.note,
  ].join("\n\n");
}

function demo(lang: Locale): string {
  const d = getDict(lang);
  return [d.demo.lead, d.wallet.validity, lang === "vi" ? "Ví dùng thử là công cụ tương tác; hãy mở bản HTML để dùng." : "The demo wallet is interactive; open the HTML page to use it."].join("\n\n");
}

function basis(lang: Locale): string {
  const b = getDict(lang).basis;
  return [b.lead, `## ${b.life.title}`, list(b.life.points), `## ${b.assumptions.title}`, table([[b.assumptions.item, b.assumptions.value, b.assumptions.source], ...b.assumptions.rows])].join("\n\n");
}

function block(b: Block): string {
  if (typeof b === "string") return b;
  if ("list" in b) return list(b.list);
  return table(b.table.map((r) => r.map((c) => c || " ")));
}

function legal(lang: Locale, slug: LegalSlug): string {
  const page = LEGAL[lang][slug];
  return [page.intro, ...page.sections.map((s) => `## ${s.h}\n\n${s.body.map(block).join("\n\n")}`)].join("\n\n");
}

/** Markdown của một trang, hoặc null nếu đường dẫn không có trang. */
export function pageMarkdown(lang: Locale, path: string, origin: string): string | null {
  if (!(PAGE_PATHS as readonly string[]).includes(path)) return null;
  const p = path as PagePath;
  const body =
    p === "" ? home(lang)
    : p === "tinh-phi" ? pricing(lang)
    : p === "cis" ? cis(lang)
    : p === "vi-cham-soc" ? demo(lang)
    : p === "co-so-dinh-phi" ? basis(lang)
    : legal(lang, p as LegalSlug);
  return `${header(lang, p, origin)}\n\n${body}\n`;
}

/** Trang 404 dạng Markdown, có đường dẫn tới các trang có thật. */
export function notFoundMarkdown(lang: Locale, requested: string, origin: string): string {
  const d = getDict(lang);
  const links = PAGE_PATHS.map((p) => `- [${pageTitle(lang, p)}](${origin}/${lang}${p ? `/${p}` : ""})`).join("\n");
  const intro =
    lang === "vi"
      ? `Không tìm thấy trang \`${requested}\` trên Family Reconnect (HTTP 404). Các trang có trên trang web:`
      : `The page \`${requested}\` does not exist on Family Reconnect (HTTP 404). These pages do:`;
  const more =
    lang === "vi"
      ? `Mục lục cho agent: [llms.txt](${origin}/llms.txt) · Sơ đồ trang: [sitemap.xml](${origin}/sitemap.xml)`
      : `Agent index: [llms.txt](${origin}/llms.txt) · Sitemap: [sitemap.xml](${origin}/sitemap.xml)`;
  return `# ${lang === "vi" ? "Không tìm thấy trang" : "Page not found"}\n\n${intro}\n\n${links}\n\n${more}\n\n_${d.meta.title}_\n`;
}
