"use client";

import { useState, type FormEvent } from "react";
import type { Locale } from "@/i18n";
import { ACTUARIAL_T } from "@/i18n/actuarial";
import type { RunResult } from "@/lib/actuarial-db/run";

type Defaults = {
  fatherAge: number; motherAge: number; childAge: number; sumAssured: number; termYears: number;
  pricingRate: number; valuationRate: number; tpdUplift: number; mortalityMultiplier: number; tpdMultiplier: number;
  dependenceShare: number; claimHandling: number; reinsurance: number; riskMargin: number; profit: number;
  adminPerYear: number; acquisition: number; commission1: number; commission2: number; commission3: number; cededShare: number;
};

const childBand = (a: number) => (a <= 2 ? "0-2" : a <= 5 ? "3-5" : a <= 8 ? "6-8" : "9-12");

export function Workbench({ lang, defaults, riderRates }: { lang: Locale; defaults: Defaults; riderRates: { parentBand: string; childBand: string; tariff: number }[] }) {
  const t = ACTUARIAL_T[lang].wb;
  const loc = lang === "vi" ? "vi-VN" : "en-US";
  const [v, setV] = useState<Defaults>(defaults);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [res, setRes] = useState<RunResult | null>(null);
  const [repro, setRepro] = useState<string>("");

  const money = (x: number) => `${Math.round(x).toLocaleString(loc)} ${lang === "vi" ? "đ" : "VND"}`;
  const exact = (x: number) => x.toLocaleString(loc, { maximumFractionDigits: 2, minimumFractionDigits: 2 });
  const p = (x: number, d = 6) => x.toLocaleString(loc, { maximumFractionDigits: d, minimumFractionDigits: d });

  const num = (k: keyof Defaults, label: string, step = "any") => (
    <div className="field">
      <label htmlFor={`wb-${k}`}>{label}</label>
      <input id={`wb-${k}`} className="input" type="number" inputMode="decimal" step={step} value={v[k]} onChange={(e) => setV({ ...v, [k]: e.target.value === "" ? ("" as unknown as number) : Number(e.target.value) })} required />
    </div>
  );

  async function calc(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    setRepro("");
    const r = await fetch("/api/actuarial/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fatherAge: v.fatherAge,
        motherAge: v.motherAge,
        overrides: {
          sumAssured: v.sumAssured, termYears: v.termYears, pricingRate: v.pricingRate, valuationRate: v.valuationRate,
          tpdUplift: v.tpdUplift, mortalityMultiplier: v.mortalityMultiplier, tpdMultiplier: v.tpdMultiplier, dependenceShare: v.dependenceShare,
          claimHandling: v.claimHandling, reinsurance: v.reinsurance, riskMargin: v.riskMargin, profit: v.profit,
          adminPerYear: v.adminPerYear, acquisition: v.acquisition, commission: [v.commission1, v.commission2, v.commission3], cededShare: v.cededShare,
        },
      }),
    }).catch(() => null);
    setBusy(false);
    const j = r ? await r.json().catch(() => ({})) : {};
    if (!r?.ok) return setErr(j.error ?? "error");
    setRes(j as RunResult);
  }

  async function reproduce() {
    if (!res) return;
    const r = await fetch(`/api/actuarial/runs/${res.runId}`).catch(() => null);
    const j = r ? await r.json().catch(() => ({})) : {};
    setRepro(r?.ok ? t.reproduced.replace("{ok}", j.reproduction.identical ? t.yes : t.no) : String(j.error ?? "error"));
  }

  const L = res?.life;
  const b = res?.basis;
  const older = Math.max(v.fatherAge, v.motherAge) <= 39 ? "25-39" : "40-49";
  const rider = riderRates.find((r) => r.parentBand === older && r.childBand === childBand(v.childAge))?.tariff ?? 0;

  return (
    <div style={{ display: "grid", gap: 24 }}>
      <form className="box" onSubmit={calc}>
        <h2 className="box-title">{t.inputs}</h2>
        <p className="fine">{t.percentHint}</p>
        <div className="wb-grid">
          {num("fatherAge", t.father, "1")}
          {num("motherAge", t.mother, "1")}
          {num("childAge", t.child, "1")}
          {num("sumAssured", t.sum, "1000000")}
          {num("termYears", t.term, "1")}
          {num("pricingRate", t.pricingRate)}
          {num("valuationRate", t.valuationRate)}
          {num("tpdUplift", t.tpdUplift)}
          {num("mortalityMultiplier", t.mortalityMultiplier)}
          {num("tpdMultiplier", t.tpdMultiplier)}
          {num("dependenceShare", t.dependence)}
          {num("claimHandling", t.claimHandling)}
          {num("reinsurance", t.reinsurance)}
          {num("riskMargin", t.riskMargin)}
          {num("profit", t.profit)}
          {num("adminPerYear", t.adminPerYear, "1000")}
          {num("acquisition", t.acquisition, "1000")}
          {num("commission1", `${t.commission} (1)`)}
          {num("commission2", `${t.commission} (2)`)}
          {num("commission3", `${t.commission} (3+)`)}
          {num("cededShare", t.cededShare)}
        </div>
        <div className="step-nav">
          <button className="btn btn-primary" type="submit" disabled={busy}>{busy ? t.running : t.calc}</button>
          <button className="btn btn-ghost" type="button" onClick={() => { setV(defaults); setRes(null); }}>{t.reset}</button>
        </div>
        {err && <p className="err" role="alert">{err}</p>}
      </form>

      {res && L && b && (
        <div aria-live="polite" style={{ display: "grid", gap: 16 }}>
          <div className="kpis">
            <div className="kpi"><span>PN</span><b>{money(L.netPremium)}</b><span>{exact(L.netPremium)}</span></div>
            <div className="kpi"><span>G</span><b>{money(L.grossPremium)}</b><span>{exact(L.grossPremium)}</span></div>
            <div className="kpi"><span>G + rider ({older} / {childBand(v.childAge)})</span><b>{money(L.grossPremium + rider)}</b><span>{t.combinedNote}</span></div>
          </div>
          <p className="fine">{t.run.replace("{id}", res.runId)} · <button type="button" className="btn btn-ghost btn-sm" onClick={reproduce}>{t.reproduce}</button> {repro && <span role="status">{repro}</span>}</p>

          <details className="box" open>
            <summary><b>{t.sections.premium}</b></summary>
            <p><code>A = Σ v^(t+1)·p_t·q_t</code> = {p(L.A, 8)}</p>
            <p><code>ä = Σ v^t·p_t</code> = {p(L.annuityDue, 6)} · <code>C = Σ c_(t+1)·v^t·p_t</code> = {p(L.C, 6)}</p>
            <p><code>PN = SA·A/ä</code> = {b.sumAssured.toLocaleString(loc)} × {p(L.A, 8)} / {p(L.annuityDue, 6)} = <b>{exact(L.netPremium)}</b></p>
            <p><code>G = [(1+h)·SA·A + a·ä + k] / [(1 − r − m − π)·ä − C]</code></p>
            <p>= [(1 + {b.claimHandling})·{b.sumAssured.toLocaleString(loc)}·{p(L.A, 8)} + {b.adminPerYear.toLocaleString(loc)}·{p(L.annuityDue, 6)} + {b.acquisition.toLocaleString(loc)}] / [(1 − {b.reinsurance} − {b.riskMargin} − {b.profit})·{p(L.annuityDue, 6)} − {p(L.C, 6)}]</p>
            <p>= {exact(L.grossNumerator)} / {p(L.grossDenominator, 6)} = <b>{exact(L.grossPremium)}</b></p>
          </details>

          <details className="box">
            <summary><b>{t.sections.probs}</b> · <code>q_D = 1 − (1 − q_death)(1 − q_TPD)</code>, <code>q_t = 1 − (1 − q_f)(1 − q_m)</code>, <code>p_(t+1) = p_t(1 − q_t)</code></summary>
            <div className="tbl-scroll">
              <table className="tbl nowrap">
                <thead><tr><th>{t.cols.t}</th><th>{t.cols.fa}</th><th>{t.cols.qd}</th><th>{t.cols.qtpd}</th><th>{t.cols.qe}</th><th>{t.cols.ma}</th><th>{t.cols.qd}</th><th>{t.cols.qtpd}</th><th>{t.cols.qe}</th><th>{t.cols.qj}</th><th>{t.cols.p}</th><th>{t.cols.pv}</th></tr></thead>
                <tbody>
                  {L.rows.map((r) => (
                    <tr key={r.t}>
                      <td>{r.t}</td><td>{r.fatherAge}</td><td>{p(r.qDeathFather)}</td><td title={`${p(r.qTpdBaseFather)} × ${b.tpdUplift} × ${b.tpdMultiplier}`}>{p(r.qTpdFather)}</td><td>{p(r.qEventFather)}</td>
                      <td>{r.motherAge}</td><td>{p(r.qDeathMother)}</td><td title={`${p(r.qTpdBaseMother)} × ${b.tpdUplift} × ${b.tpdMultiplier}`}>{p(r.qTpdMother)}</td><td>{p(r.qEventMother)}</td>
                      <td>{p(r.qJoint)}</td><td>{p(r.pStart)}</td><td>{exact(r.claimPv)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>

          <details className="box">
            <summary><b>{t.sections.reserve}</b> · <code>V_held = max(0, V_FPT,{(res.reserve.valuationRate * 100).toLocaleString(loc)}%, V_G,corr)</code></summary>
            <p className="fine">P_N({(res.reserve.valuationRate * 100).toLocaleString(loc)}%) = {exact(res.reserve.netPremiumValuation)} · β (FPT) = {exact(res.reserve.fptPremium)}</p>
            <div className="tbl-scroll">
              <table className="tbl nowrap">
                <thead><tr><th>{t.cols.t}</th><th>{t.cols.p}</th><th>{t.cols.raw}</th><th>{t.cols.corr}</th><th>{t.cols.net}</th><th>{t.cols.fpt}</th><th>{t.cols.held}</th></tr></thead>
                <tbody>
                  {res.reserve.rows.map((r) => (
                    <tr key={r.t}><td>{r.t}</td><td>{p(r.inForce)}</td><td>{exact(r.rawGross)}</td><td>{exact(r.correctedGross)}</td><td>{exact(r.net)}</td><td>{exact(r.fpt)}</td><td><b>{exact(r.held)}</b></td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>

          <details className="box">
            <summary><b>{t.sections.reins}</b></summary>
            <div className="tbl-scroll">
              <table className="tbl nowrap">
                <thead><tr><th>{t.cols.treaty}</th><th>{t.cols.ceded}</th><th>{t.cols.netCost}</th><th>{t.cols.retained}</th><th>{t.cols.recovery}</th><th>{t.cols.capital}</th></tr></thead>
                <tbody>
                  {res.reinsurance.map((r) => (
                    <tr key={r.treaty.treatyId}>
                      <td>{r.treaty.treatyId}{r.selected ? " ·" : ""}</td>
                      <td>{money(r.ceded.ceded)}</td><td>{money(r.ceded.netCost)}</td>
                      <td>{money(r.claim.retained)}</td><td>{money(r.claim.recovery)}</td>
                      <td>{money(r.capital[5]?.capitalGross ?? 0)} → {money(r.capital[5]?.capitalNet ?? 0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>

          <details className="box">
            <summary><b>{t.sections.versions}</b></summary>
            <ul className="fine">{Object.entries(res.versions).map(([k, rev]) => <li key={k}>{k} · r{rev} · {res.sources[k]}</li>)}</ul>
          </details>
        </div>
      )}
    </div>
  );
}
