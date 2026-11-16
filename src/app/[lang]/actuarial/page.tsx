import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fmt, hasLocale } from "@/i18n";
import { ACTUARIAL_T } from "@/i18n/actuarial";
import { DATASETS, GROUPS } from "@/lib/actuarial-db/registry";
import { WRITES_ENABLED, store, summary } from "@/lib/actuarial-db/server";
import { DatasetTable } from "@/components/actuarial/DatasetTable";

export async function generateMetadata({ params }: PageProps<"/[lang]/actuarial">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = ACTUARIAL_T[lang].center;
  return { title: t.eyebrow, description: t.lead, alternates: { canonical: `/${lang}/actuarial` } };
}

export default async function ActuarialCenter({ params }: PageProps<"/[lang]/actuarial">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = ACTUARIAL_T[lang].center;
  const s = store();
  const all = DATASETS.map((d) => summary(s, d));
  const nf = lang === "vi" ? "vi-VN" : "en-US";
  const edges = DATASETS.flatMap((d) => d.foreignKeys.map((k) => ({ from: d.id, to: k.references.dataset, via: k.fields.join(", ") })));
  const edgeGroups = [...new Set(edges.map((e) => e.to))].map((to) => ({ to, from: edges.filter((e) => e.to === to).map((e) => e.from) }));

  return (
    <>
      <section className="page-head">
        <div className="wrap sec-head" style={{ marginBottom: 0 }}>
          <p className="eyebrow">{t.eyebrow}</p>
          <h1>{t.title}</h1>
          <p className="lead">{t.lead}</p>
        </div>
      </section>
      <section className="page-sec">
        <div className="wrap" style={{ display: "grid", gap: 24 }}>
          <p className="notice">{WRITES_ENABLED ? `${t.concept}` : `${t.readOnly} ${t.concept}`}</p>
          <p className="fine">
            {fmt(t.totals, {
              n: all.length,
              rows: all.reduce((a, d) => a + d.records, 0).toLocaleString(nf),
              missing: all.filter((d) => d.status === "source_missing").length,
            })}{" "}
            · <Link href={`/${lang}/workbench`}>{t.workbench}</Link>
          </p>
          <DatasetTable lang={lang} datasets={all} groups={GROUPS} />

          <div className="box">
            <h2 className="box-title">{t.relations}</h2>
            <ul className="db-edges">
              {edgeGroups.map((g) => {
                const target = all.find((d) => d.id === g.to)!;
                return (
                  <li key={g.to}>
                    <Link href={`/${lang}/actuarial/${g.to}`}><b>{g.to}</b> {target.name}</Link>
                    <span className="fine"> ← {g.from.map((id, i) => <span key={id}>{i ? ", " : ""}<Link href={`/${lang}/actuarial/${id}`}>{id}</Link></span>)}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="box">
            <h2 className="box-title">{t.imports}</h2>
            {s.imports.length === 0 ? (
              <p className="fine">{t.noImports}</p>
            ) : (
              <ul className="ledger">
                {s.imports.slice(0, 20).map((i) => (
                  <li key={i.at + i.dataset}>
                    <span>{i.dataset} · {i.format.toUpperCase()} · {i.rows}</span>
                    <span className={i.accepted ? "plus" : "minus"}>{i.accepted ? "OK" : `${i.issues} ${lang === "vi" ? "lỗi" : "issues"}`}</span>
                    <span className="l-sub">{new Date(i.at).toLocaleString(nf)} · {i.user}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
