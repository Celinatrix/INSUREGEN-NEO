"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Dict, Locale } from "@/i18n";
import type { IllustrationRow, Occupation, Quote, Underwriting } from "@/lib/pricing";
import { affordability, type Affordability } from "@/lib/affordability";
import { LifeSensitivity } from "./LifeSensitivity";

type Props = {
  lang: Locale;
  t: Dict["pricing"];
  sumLabel: string;
  termYears: number;
  adviserHref: string;
  basisHref: string;
};

type PricingResponse = Quote & {
  lifeLow: number;
  lifeHigh: number;
  totalLow: number;
  totalHigh: number;
  loaded: boolean;
  affordability: Affordability;
  illustration: IllustrationRow[];
  tenYearLow: number;
  tenYearHigh: number;
};

const nf = (l: Locale) => (l === "vi" ? "vi-VN" : "en-US");
const full = (l: Locale, v: number) =>
  l === "vi" ? `${Math.round(v).toLocaleString("vi-VN")}đ` : `VND ${Math.round(v).toLocaleString("en-US")}`;
const short = (l: Locale, v: number) => {
  const x = (Math.round(v / 1e5) / 10).toLocaleString(nf(l), { maximumFractionDigits: 1 });
  return l === "vi" ? `${x} triệu đồng` : `VND ${x} million`;
};
const range = (l: Locale, lo: number, hi: number, f: (l: Locale, v: number) => string) =>
  lo === hi ? f(l, lo) : `${f(l, lo)} – ${f(l, hi)}`;
const pct = (l: Locale, v: number) =>
  `${(v * 100).toLocaleString(nf(l), { maximumFractionDigits: 1, minimumFractionDigits: 1 })}%`;

function Stepper({ id, label, value, min, max, onChange }: { id: string; label: string; value: number; min: number; max: number; onChange: (v: number) => void }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <div className="stepper">
        <button type="button" aria-label={`${label} −1`} onClick={() => onChange(Math.max(min, value - 1))}>−</button>
        <input
          id={id}
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          value={Number.isNaN(value) ? "" : value}
          onChange={(e) => onChange(parseInt(e.target.value, 10))}
        />
        <button type="button" aria-label={`${label} +1`} onClick={() => onChange(Math.min(max, value + 1))}>+</button>
      </div>
    </div>
  );
}

export function PricingCalculator({ lang, t, sumLabel, termYears, adviserHref, basisHref }: Props) {
  const [father, setFather] = useState(34);
  const [mother, setMother] = useState(30);
  const [child, setChild] = useState(3);
  const [smoker, setSmoker] = useState<Underwriting["smoker"]>("none");
  const [occF, setOccF] = useState<Occupation>(1);
  const [occM, setOccM] = useState<Occupation>(1);
  const [income, setIncome] = useState("");
  const [q, setQ] = useState<PricingResponse | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const ctrl = new AbortController();
    const timer = setTimeout(async () => {
      const params = new URLSearchParams({
        father: String(father),
        mother: String(mother),
        child: String(child),
        smoker,
        occF: String(occF),
        occM: String(occM),
      });
      try {
        const res = await fetch(`/api/pricing?${params}`, { signal: ctrl.signal });
        const body = await res.json();
        if (!res.ok) {
          setQ(null);
          setError(body.field === "youngestChildAge" ? t.errorChild : t.errorAge);
          return;
        }
        setError("");
        setQ(body as PricingResponse);
      } catch {
        /* bị hủy khi người dùng đổi giá trị */
      }
    }, 150);
    return () => {
      clearTimeout(timer);
      ctrl.abort();
    };
  }, [father, mother, child, smoker, occF, occM, t]);

  const validAges = [father, mother].every((a) => Number.isInteger(a) && a >= 25 && a <= 40);
  const u = t.uw;
  // Thu nhập (triệu đồng/năm, dấu phẩy là thập phân) chỉ dùng trên trình duyệt.
  const incomeNum = lang === "vi" ? income.replace(/\./g, "").replace(",", ".") : income.replace(/,/g, "");
  const incomeVnd = Math.round(Number(incomeNum.replace(/[^\d.]/g, "")) * 1e6);
  const incomeProvided = Number.isFinite(incomeVnd) && incomeVnd > 0;
  const a = q ? (incomeProvided ? affordability(q.totalLow, q.totalHigh, incomeVnd) : q.affordability) : undefined;

  return (
    <>
      <form className="est" onSubmit={(e) => e.preventDefault()} noValidate>
        <div className="est-in">
          <div className="row2">
            <Stepper id="father" label={t.father} value={father} min={25} max={40} onChange={setFather} />
            <Stepper id="mother" label={t.mother} value={mother} min={25} max={40} onChange={setMother} />
          </div>
          <Stepper id="child" label={t.child} value={child} min={0} max={11} onChange={setChild} />
          {error && <p className="err" role="alert">{error}</p>}

          <div className="field">
            <span className="flabel" id="smoker-l">{u.smoker}</span>
            <div className="seg" role="group" aria-labelledby="smoker-l">
              {(["none", "father", "mother", "both"] as const).map((k) => (
                <button key={k} type="button" aria-pressed={smoker === k} onClick={() => setSmoker(k)}>{u.smokerOpts[k]}</button>
              ))}
            </div>
          </div>
          <div className="row2">
            <div className="field">
              <label htmlFor="occF">{u.occF}</label>
              <select id="occF" className="select" value={occF} onChange={(e) => setOccF(Number(e.target.value) as Occupation)}>
                {([1, 2, 3, 4] as const).map((c) => <option key={c} value={c}>{u.occOpts[c]}</option>)}
              </select>
            </div>
            <div className="field">
              <label htmlFor="occM">{u.occM}</label>
              <select id="occM" className="select" value={occM} onChange={(e) => setOccM(Number(e.target.value) as Occupation)}>
                {([1, 2, 3, 4] as const).map((c) => <option key={c} value={c}>{u.occOpts[c]}</option>)}
              </select>
            </div>
          </div>
          <div className="field">
            <label htmlFor="income">{t.incomeLabel}</label>
            <input id="income" className="input" inputMode="numeric" placeholder={lang === "vi" ? "281,5" : "281.5"} value={income} onChange={(e) => setIncome(e.target.value)} />
            <p className="fine">{t.incomeHelp}</p>
          </div>
          <p className="fine">{u.note}</p>
          <div className="field">
            <div className="range-out"><span className="flabel">{t.sum}</span><output>{sumLabel}</output></div>
            <p className="fine">{t.sumNote}</p>
          </div>
          <div className="field">
            <div className="range-out"><span className="flabel">{t.term}</span><output>{termYears} {lang === "vi" ? "năm" : "years"}</output></div>
            <p className="fine">{t.termNote}</p>
          </div>
        </div>
        <div className="est-out" aria-live="polite">
          <span className="disclaim">{t.disclaim}</span>
          {q && a && (
            <>
              <div>
                <div className="est-per">{t.total}</div>
                <div className="est-range">{range(lang, q.totalLow, q.totalHigh, short)}</div>
                <div className="est-per">{t.monthly.replace("{m}", range(lang, q.totalLow / 12, q.totalHigh / 12, short))}</div>
              </div>
              <ul className="breakdown">
                <li><span>{t.lifeRow.replace("{sum}", sumLabel)}</span><span>{range(lang, q.lifeLow, q.lifeHigh, full)}</span></li>
                <li><span>{t.riderRow}</span><span>{full(lang, q.rider)}</span></li>
                <li><span>{t.lifeNet}</span><span>{full(lang, q.lifeNet)}</span></li>
                <li><span>{t.tenYear}</span><span>{range(lang, q.tenYearLow, q.tenYearHigh, short)}</span></li>
              </ul>
              {q.loaded && <p className="fine">{u.range}</p>}
              {incomeProvided ? (
                <p className="fine">
                  {t.affordShare.replace("{share}", a.shareLow === a.shareHigh ? pct(lang, a.shareLow) : `${pct(lang, a.shareLow)} – ${pct(lang, a.shareHigh)}`)}{" "}
                  {!a.overCap && t.affordOk}
                </p>
              ) : (
                <p className="fine">
                  {t.income
                    .replace("{share}", a.shareLow === a.shareHigh ? pct(lang, a.shareLow) : `${pct(lang, a.shareLow)} – ${pct(lang, a.shareHigh)}`)
                    .replace("{need}", short(lang, q.totalHigh / 0.12))}
                </p>
              )}
              {incomeProvided && a.overCap && <p className="notice warn">{t.affordOver}</p>}
              {incomeProvided && a.belowMinIncome && <p className="notice warn">{t.affordMin}</p>}
              <p className="fine">{t.engineNote}</p>
            </>
          )}
          <p className="fine">{t.underwriting}</p>
          <Link className="btn btn-primary" href={adviserHref}>{t.adviser}</Link>
        </div>
      </form>

      {q && <Illustration lang={lang} t={t.illus} rows={q.illustration} basisHref={basisHref} sumLabel={sumLabel} />}
      {validAges && <LifeSensitivity lang={lang} t={t.sens} fatherAge={father} motherAge={mother} />}
    </>
  );
}

function Illustration({ lang, t, rows, basisHref, sumLabel }: { lang: Locale; t: Dict["pricing"]["illus"]; rows: IllustrationRow[]; basisHref: string; sumLabel: string }) {
  const r = (lo: number, hi: number) => range(lang, lo, hi, full);
  return (
    <section className="box" aria-labelledby="illus-title">
      <div className="sec-head" style={{ marginBottom: 0 }}>
        <p className="eyebrow">{t.eyebrow}</p>
        <h2 id="illus-title" style={{ fontSize: "clamp(26px,3.4vw,36px)" }}>{t.title}</h2>
        <p className="fine">{t.lead}</p>
      </div>
      <div className="tbl-scroll" tabIndex={0}>
        <table className="tbl nowrap" style={{ minWidth: 980 }}>
          <thead>
            <tr>
              <th>{t.year}</th>
              <th>{t.ages}</th>
              <th>{t.life}</th>
              <th>{t.rider}</th>
              <th>{t.total}</th>
              <th>{t.cumulative}</th>
              <th>{t.inForce}</th>
              <th>{t.benefit}</th>
              <th>{t.surrender}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((x) => (
              <tr key={x.year}>
                <td>{x.year}</td>
                <td>{x.fatherAge} / {x.motherAge} / {x.childAge}</td>
                <td>{r(x.lifeLow, x.lifeHigh)}</td>
                <td>{x.rider === null ? <span className="fine">{t.noRider}</span> : full(lang, x.rider)}</td>
                <td>{r(x.totalLow, x.totalHigh)}</td>
                <td>{r(x.cumulativeLow, x.cumulativeHigh)}</td>
                <td>{(x.inForce * 100).toLocaleString(lang === "vi" ? "vi-VN" : "en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}%</td>
                <td>{sumLabel}</td>
                <td>0</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="fine">{t.riderBenefits}</p>
      <p className="notice warn">{t.noSurrender}</p>
      <Link className="btn btn-ghost btn-sm" style={{ justifySelf: "start" }} href={basisHref}>{t.basis}</Link>
    </section>
  );
}
