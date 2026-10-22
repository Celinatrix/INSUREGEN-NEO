import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fmt, getDict, hasLocale, vnd } from "@/i18n";
import { jointLife, rateTable, valuationReserves } from "@/lib/actuarial";
import { LIFE_PREMIUM_POINTS } from "@/lib/product";

export async function generateMetadata({ params }: PageProps<"/[lang]/co-so-dinh-phi">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const d = getDict(lang);
  return { title: d.basis.title, description: d.basis.lead, alternates: { canonical: `/${lang}/co-so-dinh-phi` } };
}

// Sheet Family Tariffs (file định phí bổ trợ), dòng Base: trung bình đều 3 nhóm con 0–2, 3–5, 6–8
// (báo cáo Phụ lục C.4, D, Bảng 6.5). Giờ tặng = (169.000 + 130.000 + 130.000) / 3 = 143.000 (Phụ lục C.2).
const RIDER_BUILD = {
  "25-39": [442_743.03, 331_080.87, 12_498.07, 40_000, 143_000, 12_500, 0.51, 1_925_141.13],
  "40-49": [455_292.44, 345_649.48, 12_781.52, 40_000, 143_000, 12_500, 0.51, 1_978_869.49],
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
  // Phụ lục A.4 báo cáo final: cặp 40/40, gộp raw 4,5%, thuần 3%, FPT 3%, dự phòng giữ lại.
  const val = valuationReserves(40, 40);
  const maxHeld = Math.max(...val.rows.map((r) => r.held));
  const peak = val.rows.reduce((m, r) => (r.held > val.rows[m].held ? r.t : m), 0);
  const mil = (x: number) => (Math.abs(x) < 5e3 ? "0" : (x / 1e6).toLocaleString(loc, { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
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
            <table className="tbl" style={{ minWidth: 760 }}>
              <thead><tr><th>{b.reserve.t}</th><th>{b.reserve.raw}</th><th>{b.reserve.net}</th><th>{b.reserve.fpt}</th><th>{b.reserve.held}</th><th aria-hidden="true" /></tr></thead>
              <tbody>
                {val.rows.map((r) => (
                  <tr key={r.t} className={r.t === peak ? "hl" : ""}>
                    <td>t = {r.t}</td>
                    <td style={{ color: r.rawGross < -0.005e6 ? "var(--coral-ink)" : undefined }}>{mil(r.rawGross)}</td>
                    <td>{mil(r.net)}</td>
                    <td>{mil(r.fpt)}</td>
                    <td><b>{mil(r.held)}</b></td>
                    <td aria-hidden="true" style={{ width: 140 }}>
                      <div style={{ height: 10, borderRadius: 3, background: "var(--ok)", width: `${(r.held / maxHeld) * 100}%` }} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="fine">{fmt(b.reserve.note, { net: money(val.netPremium), fpt: money(val.fptPremium), gross: money(val.gross) })}</p>
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
                      <tr key={label} className={i === 7 ? "hl" : ""}>
                        <td>{label}</td>
                        {(["25-39", "40-49"] as const).map((k) => (
                          <td key={k}>{i === 6 ? RIDER_BUILD[k][i].toLocaleString(loc) : money(RIDER_BUILD[k][i])}</td>
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
