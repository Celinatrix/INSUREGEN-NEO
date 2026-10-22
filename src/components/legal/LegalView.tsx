import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, type Locale } from "@/i18n";
import { LEGAL, LEGAL_UPDATED, type Block, type LegalSlug } from "@/i18n/legal";

export async function legalMetadata(params: Promise<{ lang: string }>, slug: LegalSlug): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const p = LEGAL[lang][slug];
  return { title: p.title, description: p.description, alternates: { canonical: `/${lang}/${slug}` } };
}

function BlockView({ b }: { b: Block }) {
  if (typeof b === "string") return <p>{b}</p>;
  if ("list" in b) return <ul>{b.list.map((x) => <li key={x}>{x}</li>)}</ul>;
  const [head, ...rows] = b.table;
  return (
    <div className="tbl-scroll" tabIndex={0} role="region" aria-label={head.join(", ")}>
      <table className="tbl legal-tbl">
        <thead><tr>{head.map((h) => <th key={h} scope="col">{h}</th>)}</tr></thead>
        <tbody>{rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}

export async function LegalView({ params, slug }: { params: Promise<{ lang: string }>; slug: LegalSlug }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const p = LEGAL[lang as Locale][slug];
  const updated = new Date(LEGAL_UPDATED).toLocaleDateString(lang === "vi" ? "vi-VN" : "en-GB", { day: "numeric", month: "long", year: "numeric" });
  return (
    <>
      <div className="wrap page-head">
        <div className="sec-head" style={{ marginBottom: 0 }}>
          <p className="eyebrow">{lang === "vi" ? `Cập nhật ${updated}` : `Updated ${updated}`}</p>
          <h1>{p.title}</h1>
          <p className="lead">{p.intro}</p>
        </div>
      </div>
      <div className="wrap page-sec">
        <article className="box legal">
          {p.sections.map((s) => (
            <section key={s.h}>
              <h2>{s.h}</h2>
              {s.body.map((b, i) => <BlockView key={i} b={b} />)}
            </section>
          ))}
        </article>
      </div>
    </>
  );
}
