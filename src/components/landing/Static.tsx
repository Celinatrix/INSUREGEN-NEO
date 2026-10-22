// Các phần tĩnh của trang chủ (Server Components).
import Link from "next/link";
import { type Dict, type Locale, commonVars, fmt } from "@/i18n";
import {
  ACTIVITIES,
  CHILD_BANDS,
  CIS_WEIGHTS,
  CREDITS_PER_SERVICE_UNIT,
  SERVICE_UNIT,
  MARKET,
  PATHWAY_A_TIERS,
  PATHWAY_B_TIERS,
  RIDER,
  SERVICES,
} from "@/lib/product";

const Check = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m5 12 5 5 9-10" />
  </svg>
);
const Alert = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
    <path d="M12 7v6M12 17h.01" />
    <circle cx="12" cy="12" r="10" />
  </svg>
);

export function Hero({ lang, d }: { lang: Locale; d: Dict }) {
  const v = commonVars(lang);
  const h = d.hero;
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <p className="pillars">{h.pillars.map((p) => <span key={p}>{p}</span>)}</p>
          <h1 id="hero-title">
            {h.titleA} <em>{h.titleB}</em>
          </h1>
          <p className="lead">{fmt(h.lead, v)}</p>
          <div className="cta-row">
            <Link className="btn btn-primary" href={`/${lang}/tinh-phi`}>{h.ctaPrimary}</Link>
            <a className="btn btn-ghost" href="#vi-cham-soc">{h.ctaSecondary}</a>
          </div>
          <ul className="facts">
            {h.facts.map((f) => (
              <li key={f}><Check /><span>{fmt(f, v)}</span></li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function Problem({ lang, d }: { lang: Locale; d: Dict }) {
  const p = d.problem;
  const num = (x: number) => x.toLocaleString(lang === "vi" ? "vi-VN" : "en-US");
  const [lo, hi] = MARKET.childcareCostPerStay;
  const stats = [
    `${Math.round(MARKET.twoGenerationShare * 100)}%`,
    `${Math.round(MARKET.admissionProb10y * 100)}%`,
    `${num(MARKET.avgStayDays)} ${d.units.days}`,
    lang === "vi" ? `${num(lo / 1e6)}–${num(hi / 1e6)} tr` : `VND ${num(lo / 1e6)}–${num(hi / 1e6)}m`,
  ];
  return (
    <section className="sec-alt" id="van-de" aria-labelledby="problem-title">
      <div className="wrap">
        <div className="sec-head">
          <span className="tag">{p.tag}</span>
          <h2 id="problem-title">{p.title}</h2>
          <p className="lead">{p.lead}</p>
        </div>
        <ol className="timeline">
          {p.days.map((day) => (
            <li className="day" key={day.badge}>
              <div className="day-badge">{day.badge}</div>
              <div className="day-body">
                <h3>{day.title}</h3>
                <ul className="losses">
                  {day.items.map((it) => (
                    <li key={it.text}>
                      <Alert />
                      <span>{it.time && <span className="time">{it.time} </span>}{it.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
        <p className="problem-close">{p.close}</p>
        <ul className="pstats">
          {stats.map((s, i) => (
            <li key={i}><b>{s}</b><span>{p.stats[i]}</span></li>
          ))}
        </ul>
        <p className="fine">{p.source}</p>
      </div>
    </section>
  );
}

export function WalletSection({ lang, d }: { lang: Locale; d: Dict }) {
  const w = d.wallet;
  const v = commonVars(lang);
  const aTiers = [...PATHWAY_A_TIERS].reverse();
  const bTiers = [...PATHWAY_B_TIERS].reverse();
  const maxBar = PATHWAY_B_TIERS[0].hours;
  const dec = (x: number) => x.toLocaleString(lang === "vi" ? "vi-VN" : "en-US", { minimumFractionDigits: 2 });
  const Rung = ({ label, hours, cls = "" }: { label: React.ReactNode; hours: number; cls?: string }) => (
    <li className={`rung ${cls}`}>
      <div className="r-when">{label}</div>
      <div className="r-hours">{hours}<small>{d.units.hours}</small></div>
      <div className="track"><span style={{ width: `${(hours / maxBar) * 100}%` }} /></div>
    </li>
  );
  return (
    <section className="sec-alt" id="vi-cham-soc" aria-labelledby="wallet-title">
      <div className="wrap">
        <div className="sec-head">
          <p className="eyebrow">{w.eyebrow}</p>
          <h2 id="wallet-title">{w.title}</h2>
          <p className="lead">{fmt(w.lead, v)}</p>
        </div>
        <div className="panel-grid">
          <div>
            <h3 className="path-h"><span className="path-k">A</span>{w.a}</h3>
            <ol className="ladder">
              {aTiers.map((t, i) => <Rung key={t.minDays} label={w.aTiers[i]} hours={t.hours} />)}
              <li className="rung emergency">
                <div className="r-when">{w.cashTitle} <span className="r-sub">{fmt(w.cashSub, v)}</span></div>
                <div className="r-hours cash">{RIDER.hospitalCashPerDay / 1000}k<small>{d.units.perDay}</small></div>
              </li>
            </ol>
            <h3 className="path-h" style={{ marginTop: 28 }}><span className="path-k">B</span>{w.b}</h3>
            <ol className="ladder">
              {bTiers.map((t, i) => {
                const next = bTiers[i + 1];
                const label = next ? `CIS ${dec(t.minScore)} – ${w.below} ${dec(next.minScore)}` : `CIS ${dec(t.minScore)} – ${dec(1)}`;
                return <Rung key={t.minScore} label={label} hours={t.hours} cls={next ? "" : "child"} />;
              })}
            </ol>
          </div>
          <aside className="aside-card">
            <span className="tag ok">{w.asideTag}</span>
            <h3>{w.a}</h3>
            <ul>{w.asideA.map((x) => <li key={x}>{x}</li>)}</ul>
            <h3>{w.b}</h3>
            <ul>{w.asideB.map((x) => <li key={x}>{x}</li>)}</ul>
            <p className="fine">{w.validity}</p>
          </aside>
        </div>
        <div className="cis">
          <div className="cis-head">
            <div style={{ display: "grid", gap: 6 }}>
              <h3>{w.cisTitle}</h3>
              <p className="fine">{w.cisNote}</p>
            </div>
            <Link className="btn btn-ghost btn-sm" href={`/${lang}/cis`}>{w.cisCta}</Link>
          </div>
          <CisWeightsTable lang={lang} d={d} />
        </div>
      </div>
    </section>
  );
}

export function CisWeightsTable({ d }: { lang: Locale; d: Dict }) {
  return (
    <div className="tbl-scroll">
      <table className="tbl">
        <thead>
          <tr>
            <th>{d.wallet.activity}</th>
            {CHILD_BANDS.map((b, i) => <th key={b}>{i === 0 ? `${d.wallet.child} ` : ""}{b.replace("-", "–")}</th>)}
          </tr>
        </thead>
        <tbody>
          {ACTIVITIES.map((a) => (
            <tr key={a}>
              <td>{a} · {d.activities[a]}</td>
              {CHILD_BANDS.map((b) => <td key={b}>{Math.round(CIS_WEIGHTS[b][a] * 100)}%</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const SERVICE_IMG = {
  childcare: "/images/services-childcare.webp",
  meals: "/images/services-meals.webp",
  transport: "/images/services-school.webp",
  housekeeping: "/images/services-housekeeping.webp",
} as const;

export function Services({ d }: { d: Dict }) {
  const s = d.services;
  return (
    <section id="dich-vu" aria-labelledby="svc-title" className="defer">
      <div className="wrap">
        <div className="sec-head">
          <p className="eyebrow">{s.eyebrow}</p>
          <h2 id="svc-title">{s.title}</h2>
          <p className="lead">{s.lead}</p>
        </div>
        <div className="services">
          {SERVICES.map((k) => (
            <article className="svc" key={k}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="svc-photo" src={SERVICE_IMG[k]} alt={s.alts[k]} loading="lazy" width={640} height={400} />
              <h3>{s.names[k]}</h3>
              <ul>{s.bullets[k].map((b) => <li key={b}>{b}</li>)}</ul>
              <p className="rate">{fmt(SERVICE_UNIT[k] === "trip" ? s.rateTrip : s.rate, { n: CREDITS_PER_SERVICE_UNIT[k] })}</p>
            </article>
          ))}
        </div>
        <p className="fine" style={{ marginTop: 12 }}>{s.photoCredit}</p>
        <div className="partners">
          <span>{s.standardsLabel}</span>
          {s.standards.map((x) => <b key={x}>{x}</b>)}
        </div>
      </div>
    </section>
  );
}

export function Why({ d }: { d: Dict }) {
  const w = d.why;
  return (
    <section className="sec-alt defer" id="khac-biet" aria-labelledby="why-title">
      <div className="wrap">
        <div className="sec-head">
          <p className="eyebrow">{w.eyebrow}</p>
          <h2 id="why-title">{w.title}</h2>
        </div>
        <div className="everyday">
          {w.items.map((it) => (
            <div className="ev" key={it.t}>
              <div className="ev-num">{it.n}<small>{it.u}</small></div>
              <h3>{it.t}</h3>
              <p>{it.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Trust({ lang, d }: { lang: Locale; d: Dict }) {
  const t = d.trust;
  const v = commonVars(lang);
  const Arrow = () => (
    <div className="arrow" aria-hidden="true">
      <svg viewBox="0 0 36 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12h30M24 4l8 8-8 8" /></svg>
    </div>
  );
  return (
    <section id="minh-bach" aria-labelledby="trust-title" className="defer">
      <div className="wrap">
        <div className="sec-head">
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 id="trust-title">{t.title}</h2>
        </div>
        <div className="trust-grid">
          <div className="box">
            <h3>{t.exclTitle}</h3>
            <ul className="excl">
              {t.excl.map((x) => (
                <li key={x.t}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
                  <div><b>{x.t}</b><p>{fmt(x.d, v)}</p></div>
                </li>
              ))}
            </ul>
            <p className="fine">{t.exclNote}</p>
          </div>
          <div className="box">
            <h3>{t.whoTitle}</h3>
            <ul className="excl data-list">
              {t.who.map((x) => (
                <li key={x.t}><Check /><div><b>{x.t}</b><p>{x.d}</p></div></li>
              ))}
            </ul>
          </div>
          <div className="box tpa">
            <h3>{t.flowTitle}</h3>
            <div className="tpa-flow" role="list">
              {t.flow.map((x, i) => (
                <div key={x.t} style={{ display: "contents" }}>
                  {i > 0 && <Arrow />}
                  <div className={`node${i === t.flow.length - 1 ? " fam" : ""}`} role="listitem">
                    <span className="k">{t.step} {i + 1}</span>
                    <b>{x.t}</b>
                    <p>{x.d}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flows">
              {t.flows.map((x) => <div key={x.t}><b>{x.t}</b> {x.d}</div>)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Faq({ lang, d }: { lang: Locale; d: Dict }) {
  const f = d.faq;
  const v = commonVars(lang);
  return (
    <section className="sec-alt defer" id="hoi-dap" aria-labelledby="faq-title">
      <div className="wrap faq-grid">
        <div className="sec-head">
          <p className="eyebrow">{f.eyebrow}</p>
          <h2 id="faq-title">{f.title}</h2>
        </div>
        <div className="faq">
          {f.items.map((it) => (
            <details key={it.q}>
              <summary>{it.q}<span className="pm" aria-hidden="true">+</span></summary>
              <div className="ans"><p>{fmt(it.a, v)}</p></div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
