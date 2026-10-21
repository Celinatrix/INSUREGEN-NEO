"use client";

import { useMemo, useState } from "react";
import type { Dict, Locale } from "@/i18n";
import { BASE_LIFE, LIFE_SCENARIOS, jointLife } from "@/lib/actuarial";

// Sheet Tong_hop, mục 4 (Rider tornado): Δ% thấp / cao so với phí bổ trợ cơ sở của file độ nhạy.
const RIDER_TORNADO: [number, number][] = [
  [-0.1733, 0.3465],
  [-0.1596, 0.1855],
  [-0.1122, 0.2243],
  [-0.0881, 0.107],
  [-0.0766, 0.0766],
  [-0.0641, 0.0641],
];

type Props = { lang: Locale; t: Dict["pricing"]["sens"]; fatherAge: number; motherAge: number };

export function LifeSensitivity({ lang, t, fatherAge, motherAge }: Props) {
  const [mD, setMD] = useState(1);
  const [mT, setMT] = useState(1);
  const [i, setI] = useState(BASE_LIFE.interest);
  const [p, setP] = useState(BASE_LIFE.profit);
  const nf = lang === "vi" ? "vi-VN" : "en-US";
  const money = (v: number) => (lang === "vi" ? `${Math.round(v).toLocaleString(nf)}đ` : `VND ${Math.round(v).toLocaleString(nf)}`);
  const pct = (v: number) => `${v > 0 ? "+" : ""}${(v * 100).toLocaleString(nf, { maximumFractionDigits: 1, minimumFractionDigits: 1 })}%`;
  const num = (v: number, d = 2) => v.toLocaleString(nf, { maximumFractionDigits: d });

  const base = useMemo(() => jointLife(fatherAge, motherAge).gross, [fatherAge, motherAge]);
  const custom = useMemo(
    () => jointLife(fatherAge, motherAge, { mortalityMult: mD, tpdMult: mT, interest: i, profit: p }).gross,
    [fatherAge, motherAge, mD, mT, i, p],
  );
  const scenarios = useMemo(
    () => LIFE_SCENARIOS.map((s) => ({ key: s.key, gross: jointLife(fatherAge, motherAge, s.over).gross })),
    [fatherAge, motherAge],
  );
  const maxBar = Math.max(...RIDER_TORNADO.map(([a, b]) => Math.max(-a, b)));

  const Slider = ({ id, label, value, min, max, step, show, on }: { id: string; label: string; value: number; min: number; max: number; step: number; show: string; on: (v: number) => void }) => (
    <div className="field">
      <div className="range-out"><label htmlFor={id} className="flabel">{label}</label><output htmlFor={id}>{show}</output></div>
      <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(e) => on(Number(e.target.value))} style={{ width: "100%", accentColor: "var(--coral)" }} />
    </div>
  );

  return (
    <section className="box" aria-labelledby="sens-title" style={{ gap: 24 }}>
      <div className="sec-head" style={{ marginBottom: 0 }}>
        <p className="eyebrow">{t.eyebrow}</p>
        <h2 id="sens-title" style={{ fontSize: "clamp(26px,3.4vw,36px)" }}>{t.title}</h2>
        <p className="fine">{t.lead} <b>{t.pair} {fatherAge}/{motherAge}</b></p>
      </div>
      <div className="demo-grid">
        <div style={{ display: "grid", gap: 14 }}>
          {Slider({ id: "s-md", label: t.mortality, value: mD, min: 0.5, max: 2, step: 0.05, show: num(mD), on: setMD })}
          {Slider({ id: "s-mt", label: t.tpd, value: mT, min: 0.5, max: 3, step: 0.05, show: num(mT), on: setMT })}
          {Slider({ id: "s-i", label: t.interest, value: i, min: 0.03, max: 0.1, step: 0.005, show: `${num(i * 100, 1)}%`, on: setI })}
          {Slider({ id: "s-p", label: t.profit, value: p, min: 0, max: 0.2, step: 0.01, show: `${num(p * 100, 0)}%`, on: setP })}
          <button type="button" className="btn btn-ghost btn-sm" style={{ justifySelf: "start" }}
            onClick={() => { setMD(1); setMT(1); setI(BASE_LIFE.interest); setP(BASE_LIFE.profit); }}>{t.reset}</button>
        </div>
        <div className="est-out" style={{ borderRadius: "var(--radius-lg)" }} aria-live="polite">
          <div className="est-per">{t.result}</div>
          <div className="big-num" style={{ fontSize: "clamp(32px,4.4vw,46px)" }}>{money(custom)}</div>
          <div className="est-per">{pct(custom / base - 1)} {t.vsBase} ({money(base)})</div>
          <p className="fine">{t.breakEven}</p>
        </div>
      </div>

      <div style={{ display: "grid", gap: 10 }}>
        <h3>{t.scenTitle}</h3>
        <div className="tbl-scroll">
          <table className="tbl">
            <thead><tr><th>{t.scenario}</th><th>{t.premium}</th><th>{t.change}</th></tr></thead>
            <tbody>
              {scenarios.map((s) => (
                <tr key={s.key} className={s.key === "base" ? "hl" : ""}>
                  <td><b>{t.scen[s.key].n}</b><br /><span className="fine">{t.scen[s.key].d}</span></td>
                  <td>{money(s.gross)}</td>
                  <td>{s.key === "base" ? "—" : pct(s.gross / base - 1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ display: "grid", gap: 10 }}>
        <h3>{t.riderTitle}</h3>
        <div style={{ display: "grid", gap: 10 }}>
          {RIDER_TORNADO.map(([lo, hi], k) => (
            <div key={k} style={{ display: "grid", gridTemplateColumns: "minmax(0,1.1fr) 58px minmax(0,1fr) 58px", gap: 8, alignItems: "center" }}>
              <span style={{ fontSize: 14 }}>{t.riderFactors[k]}</span>
              <span className="fine num" style={{ fontSize: 12, textAlign: "right" }}>{pct(lo)}</span>
              <div aria-label={`${t.low} ${pct(lo)}, ${t.high} ${pct(hi)}`} style={{ position: "relative", height: 22 }}>
                <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 1, background: "var(--line)" }} />
                <div style={{ position: "absolute", right: "50%", top: 3, height: 16, width: `${(-lo / maxBar) * 50}%`, background: "var(--ok)", borderRadius: "4px 0 0 4px" }} />
                <div style={{ position: "absolute", left: "50%", top: 3, height: 16, width: `${(hi / maxBar) * 50}%`, background: "var(--coral)", borderRadius: "0 4px 4px 0" }} />
              </div>
              <span className="fine num" style={{ fontSize: 12 }}>{pct(hi)}</span>
            </div>
          ))}
        </div>
        <p className="fine">{t.riderNote}</p>
      </div>
    </section>
  );
}
