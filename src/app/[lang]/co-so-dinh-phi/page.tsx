import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDict, hasLocale, vnd } from "@/i18n";
import { grossReserves, jointLife, rateTable } from "@/lib/actuarial";
import { LIFE_PREMIUM_POINTS } from "@/lib/product";

export async function generateMetadata({ params }: PageProps<"/[lang]/co-so-dinh-phi">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const d = getDict(lang);
  return { title: d.basis.title, description: d.basis.lead, alternates: { canonical: `/${lang}/co-so-dinh-phi` } };
}

// Sheet Family Tariffs (file định phí bổ trợ), dòng Base
const RIDER_BUILD = {
  "25-39": [442_743.03, 331_080.87, 12_498.07, 40_000, 12_500, 0.51, 1_925_141.13],
  "40-49": [455_292.44, 345_649.48, 12_781.52, 40_000, 12_500, 0.51, 1_978_869.5],
} as const;

const IDS = ["nhan-tho", "gia-dinh", "kiem-chung", "bang-ty-le", "du-phong", "bo-tro", "tham-dinh", "nguon"];

export default async function BasisPage({ params }: PageProps<"/[lang]/co-so-dinh-phi">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const d = getDict(lang);
  const b = d.basis;
  const loc = lang === "vi" ? "vi-VN" : "en-US";
  const rate = (x: number) => x.toLocaleString(loc, { minimumFractionDigits: 5, maximumFractionDigits: 5 });
  const money = (x: number) => vnd(lang, x);
  const checks = Object.entries(LIFE_PREMIUM_POINTS).map(([k, v]) => {
    const [f, m] = k.split("-").map(Number);
    const e = jointLife(f, m).gross;
    return { k: `${f} / ${m}`, reported: v, engine: e, diff: e - v };
  });
  const workbook = jointLife(35, 30).gross;
  const reserves = grossReserves(34, 30);
  const maxAbs = Math.max(...reserves.map((r) => Math.abs(r.reserve)));
  const rates = rateTable().filter((r) => r.age >= 25);

  const h = (i: number, text: string) => (
    <h2 id={IDS[i]} style={{ fontSize: "clamp(24px,3vw,32px)", scrollMarginTop: 90 }}>{text}</h2>
  );

  return (
    <>
      <div className="wrap page-head">
        <div className="sec-head" style={{ marginBottom: 0 }}>
          <p className="eyebrow">{b.eyebrow}</p>
          <h1>{b.title}</h1>
          <p className="lead">{b.lead}</p>
          <nav aria-label={b.title} className="chips" style={{ marginTop: 8 }}>
            {b.toc.map((x, i) => (
              <a key={x} href={`#${IDS[i]}`} className="btn btn-ghost btn-sm">{x}</a>
            ))}
          </nav>
        </div>
      </div>

      <div className="wrap page-sec" style={{ display: "grid", gap: 28 }}>
        <section className="box">
          {h(0, b.life.title)}
          <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 8, listStyle: "disc" }}>
            {b.life.points.map((p) => <li key={p}>{p}</li>)}
          </ul>
          <div className="tbl-scroll" tabIndex={0}>
            <pre className="notice" style={{ margin: 0, fontSize: 15, whiteSpace: "pre-wrap" }}>{b.life.formula}</pre>
          </div>
          <p className="fine">{b.life.formulaNote}</p>
        </section>

        <section className="box">
          {h(1, b.assumptions.title)}
          <div className="tbl-scroll" tabIndex={0}>
            <table className="tbl">
              <thead><tr><th>{b.assumptions.item}</th><th style={{ textAlign: "left" }}>{b.assumptions.value}</th><th style={{ textAlign: "left" }}>{b.assumptions.source}</th></tr></thead>
              <tbody>
                {b.assumptions.rows.map(([a, v, s]) => (
                  <tr key={a}><td>{a}</td><td style={{ textAlign: "left" }}>{v}</td><td style={{ textAlign: "left" }} className="fine">{s}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="box">
          {h(2, b.check.title)}
          <div className="tbl-scroll" tabIndex={0}>
            <table className="tbl">
              <thead><tr><th>{b.check.pair}</th><th>{b.check.reported}</th><th>{b.check.engine}</th><th>{b.check.diff}</th></tr></thead>
              <tbody>
                <tr><td>35 / 30 (Excel)</td><td>{money(21_879_515.395486467)}</td><td>{money(workbook)}</td><td>{(workbook - 21_879_515.395486467).toLocaleString(loc, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td></tr>
                {checks.map((c) => (
                  <tr key={c.k}><td>{c.k}</td><td>{money(c.reported)}</td><td>{money(c.engine)}</td><td>{c.diff.toLocaleString(loc, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="fine">{b.check.note}</p>
        </section>

        <section className="box">
          {h(3, b.table.title)}
          <p className="fine">{b.table.note}</p>
          <div className="tbl-scroll" tabIndex={0} style={{ maxHeight: 460, overflowY: "auto" }}>
            <table className="tbl">
              <thead><tr><th>{b.table.age}</th><th>{b.table.dM}</th><th>{b.table.tM}</th><th>{b.table.dF}</th><th>{b.table.tF}</th></tr></thead>
              <tbody>
                {rates.map((r) => (
                  <tr key={r.age}><td>{r.age}</td><td>{rate(r.deathMale)}</td><td>{rate(r.tpdMale)}</td><td>{rate(r.deathFemale)}</td><td>{rate(r.tpdFemale)}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="box">
          {h(4, b.reserve.title)}
          <p className="fine">{b.reserve.lead}</p>
          <div className="tbl-scroll" tabIndex={0}>
            <table className="tbl" style={{ minWidth: 820 }}>
              <thead><tr><th>{b.reserve.t}</th><th>{b.reserve.inForce}</th><th>{b.reserve.fb}</th><th>{b.reserve.fp}</th><th>{b.reserve.raw}</th><th>{b.reserve.floored}</th><th aria-hidden="true" /></tr></thead>
              <tbody>
                {reserves.map((r) => (
                  <tr key={r.t}>
                    <td>t = {r.t}</td>
                    <td>{(r.inForce * 100).toLocaleString(loc, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%</td>
                    <td>{money(r.epvBenefits)}</td>
                    <td>{money(r.epvPremiums)}</td>
                    <td style={{ color: r.reserve < 0 ? "var(--coral-ink)" : undefined }}>{money(r.reserve)}</td>
                    <td>{money(r.reserveFloored)}</td>
                    <td aria-hidden="true" style={{ width: 160 }}>
                      <div style={{ position: "relative", height: 12 }}>
                        <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 1, background: "var(--line)" }} />
                        <div style={{
                          position: "absolute", top: 1, height: 10, borderRadius: 3,
                          background: r.reserve < 0 ? "var(--coral)" : "var(--ok)",
                          width: `${(Math.abs(r.reserve) / maxAbs) * 50}%`,
                          ...(r.reserve < 0 ? { right: "50%" } : { left: "50%" }),
                        }} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="fine">{b.reserve.note}</p>
        </section>

        <section className="box">
          {h(5, b.rider.title)}
          <ol style={{ margin: 0, paddingLeft: 22, display: "grid", gap: 8, listStyle: "decimal" }}>
            {b.rider.steps.map((s) => <li key={s}>{s}</li>)}
          </ol>
          <div className="trust-grid">
            <div style={{ display: "grid", gap: 10, minWidth: 0 }}>
              <h3>{b.rider.costTitle}</h3>
              <div className="tbl-scroll" tabIndex={0}>
                <table className="tbl" style={{ minWidth: 360 }}>
                  <thead><tr><th>{b.rider.service}</th><th>{b.rider.cost}</th></tr></thead>
                  <tbody>{b.rider.costs.map(([s, c]) => <tr key={s}><td>{s}</td><td>{c}</td></tr>)}</tbody>
                </table>
              </div>
            </div>
            <div style={{ display: "grid", gap: 10, minWidth: 0 }}>
              <h3>{b.rider.buildTitle}</h3>
              <div className="tbl-scroll" tabIndex={0}>
                <table className="tbl" style={{ minWidth: 360 }}>
                  <thead><tr><th><span className="visually-hidden">{lang === "vi" ? "Khoản" : "Item"}</span></th><th>{b.rider.older} 25–39</th><th>40–49</th></tr></thead>
                  <tbody>
                    {b.rider.build.map((label, i) => (
                      <tr key={label} className={i === 6 ? "hl" : ""}>
                        <td>{label}</td>
                        {(["25-39", "40-49"] as const).map((k) => (
                          <td key={k}>{i === 5 ? RIDER_BUILD[k][i].toLocaleString(loc) : money(RIDER_BUILD[k][i])}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <p className="fine">{b.rider.buildNote} <Link href={`/${lang}/tinh-phi`}>{d.nav.pricing}</Link></p>
        </section>

        <section className="box">
          {h(6, b.uw.title)}
          <ul className="excl">
            {b.uw.rows.map(([t, x]) => (
              <li key={t}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="m5 12 5 5 9-10" /></svg>
                <div><b>{t}</b><p>{x}</p></div>
              </li>
            ))}
          </ul>
          <p className="fine">{b.uw.note}</p>
        </section>

        <section className="box">
          {h(7, b.sources.title)}
          <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 6, listStyle: "disc" }}>
            {b.sources.list.map((s) => <li key={s}>{s}</li>)}
          </ul>
          <ul className="excl">
            {b.sources.limits.map((s) => (
              <li key={s}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 8v5M12 16h.01" /></svg>
                <div><p>{s}</p></div>
              </li>
            ))}
          </ul>
          <p className="fine">{b.sources.files}</p>
        </section>
      </div>
    </>
  );
}
