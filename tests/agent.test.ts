import { test } from "node:test";
import assert from "node:assert/strict";
import { prefersMarkdown, qualityOf } from "../src/lib/agent/negotiate.ts";
import { PAGE_PATHS, notFoundMarkdown, pageMarkdown } from "../src/lib/agent/markdown.ts";
import { MARKDOWN_HEADERS, markdownFor } from "../src/lib/agent/response.ts";
import { llmsTxt } from "../src/lib/agent/llms.ts";
import { PRODUCT_KEYWORDS, homeJsonLd, jsonLdScript } from "../src/lib/agent/jsonld.ts";

const ORIGIN = "https://example.test";

test("Accept negotiation: Markdown only when asked for and not ranked below HTML", () => {
  assert.equal(prefersMarkdown("text/markdown"), true);
  assert.equal(prefersMarkdown("text/markdown, text/html;q=0.9"), true);
  assert.equal(prefersMarkdown("text/markdown;q=0.9, */*;q=0.1"), true);
  assert.equal(prefersMarkdown("text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"), false);
  assert.equal(prefersMarkdown("text/html"), false);
  assert.equal(prefersMarkdown("*/*"), false);
  assert.equal(prefersMarkdown(""), false);
  assert.equal(prefersMarkdown(null), false);
  assert.equal(prefersMarkdown("text/html, text/markdown;q=0.5"), false);
  assert.equal(prefersMarkdown("text/markdown;q=0"), false);
  assert.equal(qualityOf("text/*;q=0.4, text/html", "text/markdown"), 0.4);
});

test("Every page has a non-empty Markdown version in both languages", () => {
  for (const lang of ["vi", "en"] as const) {
    for (const path of PAGE_PATHS) {
      const md = pageMarkdown(lang, path, ORIGIN);
      assert.ok(md && md.startsWith("# "), `${lang}/${path}`);
      assert.ok(md.length > 300, `${lang}/${path} too short`);
      assert.ok(md.includes(`${ORIGIN}/llms.txt`));
    }
  }
});

test("Home Markdown carries the same figures as the HTML page (Table 3.4 example)", () => {
  const md = pageMarkdown("en", "", ORIGIN)!;
  for (const s of ["VND 2 billion", "VND 500,000", "120 Care Hours", "8 days in hospital: VND 4,000,000 cash and 40 Care Hours", "Submit", "Verify", "Record", "Issue", "Book"]) {
    assert.ok(md.includes(s), s);
  }
  assert.ok(!md.includes("{"), "no unfilled template placeholders");
  assert.ok(!pageMarkdown("vi", "", ORIGIN)!.includes("{"));
});

test("Unknown paths get a 404 with a Markdown body that links to real pages", () => {
  const miss = markdownFor("/vi/__ora-404-probe-1jkz5oiy", ORIGIN);
  assert.equal(miss.status, 404);
  assert.ok(miss.body.length >= 20);
  assert.ok(miss.body.includes(`${ORIGIN}/llms.txt`) && miss.body.includes(`${ORIGIN}/sitemap.xml`));
  assert.ok(miss.body.includes(`${ORIGIN}/vi/tinh-phi`));
  assert.equal(markdownFor("/nope", ORIGIN).status, 404);
  assert.ok(notFoundMarkdown("en", "/x", ORIGIN).startsWith("# Page not found"));
  assert.equal(markdownFor("/en", ORIGIN).status, 200);
  assert.equal(markdownFor("/en/tinh-phi/", ORIGIN).status, 200);
});

test("Markdown responses declare their type and vary on Accept", () => {
  assert.equal(MARKDOWN_HEADERS["Content-Type"], "text/markdown; charset=utf-8");
  assert.equal(MARKDOWN_HEADERS.Vary, "Accept");
});

test("llms.txt follows llmstxt.org and says when to use the site", () => {
  const t = llmsTxt(ORIGIN);
  const lines = t.split("\n");
  assert.equal(lines[0], "# Family Reconnect");
  assert.ok(lines.some((l) => l.startsWith("> ")), "blockquote summary");
  const h2 = lines.filter((l) => l.startsWith("## "));
  assert.deepEqual(h2, ["## When to use", "## Pages", "## Optional"]);
  assert.ok(t.includes(`${ORIGIN}/api/pricing?father=34&mother=30&child=3`));
  assert.ok(t.includes("Do not use it for real quotes"));
  for (const m of t.matchAll(/^- \[[^\]]+\]\(([^)]+)\)/gm)) assert.ok(m[1].startsWith(ORIGIN), m[1]);
});

test("Home JSON-LD names the product, its maker and terms that appear on the page", () => {
  for (const lang of ["vi", "en"] as const) {
    const ld = homeJsonLd(lang, ORIGIN);
    assert.equal(ld["@context"], "https://schema.org");
    const types = ld["@graph"].map((n) => n["@type"]);
    assert.deepEqual(types, ["Organization", "WebSite", "FinancialProduct"]);
    const product = ld["@graph"][2] as Record<string, unknown>;
    assert.equal(product.name, "Family Reconnect");
    assert.equal(product.url, `${ORIGIN}/${lang}`);
    assert.ok(!("offers" in product), "no prices for a product that is not on sale");
    const page = pageMarkdown(lang, "", ORIGIN)!.toLowerCase();
    for (const k of PRODUCT_KEYWORDS[lang]) assert.ok(page.includes(k.toLowerCase()), `${lang} keyword not on page: ${k}`);
  }
  assert.ok(!jsonLdScript({ a: "</script><b>" }).includes("<"));
});
