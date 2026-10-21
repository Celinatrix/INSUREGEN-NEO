"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Dict, Locale } from "@/i18n";
import type { Quote } from "@/lib/pricing";
import { LifeSensitivity } from "./LifeSensitivity";

type Props = {
  lang: Locale;
  t: Dict["pricing"];
  sumLabel: string;
  termYears: number;
  adviserHref: string;
};

const nf = (l: Locale) => (l === "vi" ? "vi-VN" : "en-US");
const full = (l: Locale, v: number) =>
  l === "vi" ? `${Math.round(v).toLocaleString("vi-VN")}đ` : `VND ${Math.round(v).toLocaleString("en-US")}`;
const short = (l: Locale, v: number) => {
  const x = (Math.round(v / 1e5) / 10).toLocaleString(nf(l), { maximumFractionDigits: 1 });
  return l === "vi" ? `${x} triệu đồng` : `VND ${x} million`;
};

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

export function PricingCalculator({ lang, t, sumLabel, termYears, adviserHref }: Props) {
  const [father, setFather] = useState(34);
  const [mother, setMother] = useState(30);
  const [child, setChild] = useState(3);
  const [q, setQ] = useState<Quote | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const ctrl = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/pricing?father=${father}&mother=${mother}&child=${child}`, { signal: ctrl.signal });
        const body = await res.json();
        if (!res.ok) {
          setQ(null);
          setError(body.field === "youngestChildAge" ? t.errorChild : t.errorAge);
          return;
        }
        setError("");
        setQ(body as Quote);
      } catch {
        /* bị hủy khi người dùng đổi giá trị */
      }
    }, 150);
    return () => {
      clearTimeout(timer);
      ctrl.abort();
    };
  }, [father, mother, child, t]);

  const validAges = [father, mother].every((a) => Number.isInteger(a) && a >= 25 && a <= 40);

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
        {q && (
          <>
            <div>
              <div className="est-per">{t.total}</div>
              <div className="est-range">{short(lang, q.total)}</div>
              <div className="est-per">{t.monthly.replace("{m}", short(lang, q.monthly))}</div>
            </div>
            <ul className="breakdown">
              <li><span>{t.lifeRow.replace("{sum}", sumLabel)}</span><span>{full(lang, q.life)}</span></li>
              <li><span>{t.riderRow}</span><span>{full(lang, q.rider)}</span></li>
              <li><span>{t.lifeNet}</span><span>{full(lang, q.lifeNet)}</span></li>
            </ul>
            <p className="fine">
              {t.income
                .replace("{share}", `${(q.shareOfBenchmarkIncome * 100).toLocaleString(nf(lang), { maximumFractionDigits: 1, minimumFractionDigits: 1 })}%`)
                .replace("{need}", short(lang, q.incomeNeededAtCap))}
            </p>
            <p className="fine">{t.engineNote}</p>
          </>
        )}
        <p className="fine">{t.underwriting}</p>
        <Link className="btn btn-primary" href={adviserHref}>{t.adviser}</Link>
      </div>
    </form>
    {validAges && <LifeSensitivity lang={lang} t={t.sens} fatherAge={father} motherAge={mother} />}
    </>
  );
}
