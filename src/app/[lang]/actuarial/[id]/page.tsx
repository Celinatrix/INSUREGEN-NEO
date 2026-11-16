import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fmt, hasLocale } from "@/i18n";
import { ACTUARIAL_T } from "@/i18n/actuarial";
import { DATASET_BY_ID } from "@/lib/actuarial-db/registry";
import { WRITES_ENABLED, store, summary } from "@/lib/actuarial-db/server";
import { ImportForm } from "@/components/actuarial/ImportForm";
import type { DatasetId } from "@/lib/actuarial-db/types";

const SHOW = 100;

export async function generateMetadata({ params }: PageProps<"/[lang]/actuarial/[id]">): Promise<Metadata> {
  const { lang, id } = await params;
  const def = DATASET_BY_ID.get(id as DatasetId);
  if (!hasLocale(lang) || !def) return {};
  return { title: `${def.id} ${def.name}`, description: def.description, alternates: { canonical: `/${lang}/actuarial/${def.id}` } };
}

const cellText = (v: unknown) => (v === null || v === undefined ? "" : typeof v === "object" ? JSON.stringify(v) : typeof v === "number" ? String(Number(v.toPrecision(12))) : String(v));

export default async function DatasetDetail({ params }: PageProps<"/[lang]/actuarial/[id]">) {
  const { lang, id } = await params;
  const def = DATASET_BY_ID.get(id as DatasetId);
  if (!hasLocale(lang) || !def) notFound();
  const t = ACTUARIAL_T[lang].detail;
  const c = ACTUARIAL_T[lang].center;
  const s = store();
  const info = summary(s, def);
  const rows = s.rows(def.id);
  const issues = s.validate(def.id, rows);
  const cols = def.fields.map((f) => f.name);
  const rule = (f: (typeof def.fields)[number]) =>
    [f.type === "probability" ? "0 ≤ x ≤ 1" : "", f.allowed ? f.allowed.join(" | ") : "", f.min !== undefined ? `≥ ${f.min}` : "", f.max !== undefined ? `≤ ${f.max}` : ""].filter(Boolean).join("; ");

  return (
    <>
      <section className="page-head">
        <div className="wrap sec-head" style={{ marginBottom: 0 }}>
          <p className="eyebrow"><Link href={`/${lang}/actuarial`}>{t.back}</Link> · {def.group} · {info.groupName}</p>
          <h1>{def.id} {def.name}</h1>
          <p className="lead">{def.description}</p>
        </div>
      </section>
      <section className="page-sec">
        <div className="wrap" style={{ display: "grid", gap: 24 }}>
          <div className="kpis">
            <div className="kpi"><span>{c.cols.records}</span><b>{info.records.toLocaleString(lang === "vi" ? "vi-VN" : "en-US")}</b></div>
            <div className="kpi"><span>{c.cols.quality}</span><b>{c.qualityLabels[def.quality]}</b><span>{c.cols.score} {info.qualityScore}</span></div>
            <div className="kpi"><span>{c.cols.version}</span><b>{info.version}</b><span>{c.status[info.status as keyof typeof c.status]}</span></div>
          </div>

          <div className="box">
            <h2 className="box-title">{t.source}</h2>
            <p>{def.source}</p>
            <p className="fine">{t.usedBy}: {def.usedBy.map((u) => `${u.module} (${u.status === "live" ? t.live : t.planned})`).join(", ")}</p>
          </div>

          <div className="box">
            <h2 className="box-title">{t.schema}</h2>
            <div className="tbl-scroll">
              <table className="tbl">
                <thead><tr><th>{t.field}</th><th>{t.type}</th><th>{t.required}</th><th>{t.rule}</th><th>{c.cols.name}</th></tr></thead>
                <tbody>
                  {def.fields.map((f) => (
                    <tr key={f.name}>
                      <td><code>{f.name}</code>{def.primaryKey.includes(f.name) ? " · PK" : ""}</td>
                      <td>{f.type}</td>
                      <td>{f.required ? (lang === "vi" ? "Có" : "Yes") : ""}</td>
                      <td>{rule(f)}</td>
                      <td>{f.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="fine">{t.pk}: {def.primaryKey.join(", ")}</p>
            {def.foreignKeys.length > 0 && (
              <p className="fine">
                {t.fk}: {def.foreignKeys.map((k, i) => (
                  <span key={i}>{i ? "; " : ""}{k.fields.join(", ")} → <Link href={`/${lang}/actuarial/${k.references.dataset}`}>{k.references.dataset}</Link>.{k.references.fields.join(", ")}</span>
                ))}
              </p>
            )}
            {info.referencedBy.length > 0 && (
              <p className="fine">{t.referencedBy}: {info.referencedBy.map((x, i) => <span key={x}>{i ? ", " : ""}<Link href={`/${lang}/actuarial/${x}`}>{x}</Link></span>)}</p>
            )}
            <h3>{t.validation}</h3>
            <ul>{def.validation.map((v) => <li key={v}>{v}</li>)}</ul>
          </div>

          <div className="box">
            <h2 className="box-title">{t.records}</h2>
            <p className={`notice ${issues.length ? "warn" : "ok"}`} role="status">
              {t.check}: {issues.length ? `${fmt(t.checkBad, { n: issues.length })} ${issues.slice(0, 3).map((i) => `#${i.row + 1} ${i.message}`).join(" · ")}` : fmt(t.checkOk, { n: rows.length })}
            </p>
            <p className="fine">
              {t.export}: <a href={`/api/actuarial/datasets/${def.id}?format=csv`}>CSV</a> · <a href={`/api/actuarial/datasets/${def.id}?format=json`}>JSON</a>
            </p>
            {rows.length === 0 ? (
              <p className="fine">{t.none}</p>
            ) : (
              <>
                <div className="tbl-scroll">
                  <table className="tbl nowrap">
                    <thead><tr>{cols.map((col) => <th key={col}>{col}</th>)}</tr></thead>
                    <tbody>
                      {rows.slice(0, SHOW).map((r, i) => (
                        <tr key={i}>{cols.map((col) => <td key={col}>{cellText(r[col])}</td>)}</tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="fine">{fmt(t.showing, { n: Math.min(SHOW, rows.length), total: rows.length })}</p>
              </>
            )}
          </div>

          {WRITES_ENABLED && (def.quality === "computed" ? <p className="fine">{t.engineOwned}</p> : <ImportForm lang={lang} id={def.id} />)}
        </div>
      </section>
    </>
  );
}
