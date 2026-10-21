"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Dict, Locale } from "@/i18n";
import { ACTIVITIES, CHILD_BANDS, CIS_WEIGHTS, SERVICES, type ChildBand, type Severity } from "@/lib/product";
import { cisScore, pathwayBHours, unlockedServices, type Ratings } from "@/lib/rules";

const LEVELS: Severity[] = ["F0", "F1", "F2", "F3"];

export function encodeRatings(r: Ratings) {
  return ACTIVITIES.map((a) => r[a].slice(1)).join("");
}

export function CisCalculator({ lang, d, demoHref }: { lang: Locale; d: Dict; demoHref: string }) {
  const t = d.cisPage;
  const [band, setBand] = useState<ChildBand>("0-2");
  const [ratings, setRatings] = useState<Ratings>({ C1: "F3", C2: "F1", C3: "F2", C4: "F3", C5: "F0", C6: "F1" });
  const score = useMemo(() => cisScore(band, ratings), [band, ratings]);
  const hours = pathwayBHours(score, ratings);
  const unlocked = unlockedServices("B", ratings);
  const nf = lang === "vi" ? "vi-VN" : "en-US";

  return (
    <div className="demo-grid">
      <div className="box">
        <div className="field">
          <span className="flabel" id="band-label">{t.band}</span>
          <div className="seg" role="group" aria-labelledby="band-label">
            {CHILD_BANDS.map((b) => (
              <button key={b} type="button" aria-pressed={band === b} onClick={() => setBand(b)}>
                {b.replace("-", "–")}
              </button>
            ))}
          </div>
        </div>
        <div>
          {ACTIVITIES.map((a) => (
            <div className="rate-row" key={a}>
              <div style={{ display: "grid", gap: 2 }}>
                <span className="r-name">{a} · {d.activities[a]}</span>
                <span className="r-help">{d.activityHelp[a]}</span>
                <span className="r-w">{t.weight} {Math.round(CIS_WEIGHTS[band][a] * 100)}%</span>
              </div>
              <div className="seg" role="group" aria-label={`${a} ${d.activities[a]}`}>
                {LEVELS.map((lv) => (
                  <button
                    key={lv}
                    type="button"
                    title={d.severity[lv]}
                    aria-pressed={ratings[a] === lv}
                    onClick={() => setRatings((r) => ({ ...r, [a]: lv }))}
                  >
                    {lv}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="fine">{LEVELS.map((lv) => `${lv}: ${d.severity[lv]}`).join(" · ")}</p>
      </div>
      <div className="est-out cis-out" style={{ borderRadius: "var(--radius-lg)" }} aria-live="polite">
        <div>
          <div className="est-per">{t.score}</div>
          <div className="big-num">{score.toLocaleString(nf, { minimumFractionDigits: 2, maximumFractionDigits: 3 })}</div>
        </div>
        <div>
          <div className="est-per">{t.hours}</div>
          <div className="big-num">{hours}<span style={{ fontSize: 18, fontFamily: "var(--font-ui)" }}> {d.units.hours}</span></div>
        </div>
        <div style={{ display: "grid", gap: 8 }}>
          <div className="est-per">{t.unlocked}</div>
          {unlocked.length ? (
            <div className="chips">
              {SERVICES.map((s) => (
                <span key={s} className={`chip${unlocked.includes(s) ? "" : " off"}`}>{d.services.names[s]}</span>
              ))}
            </div>
          ) : (
            <p className="fine">{t.noneUnlocked}</p>
          )}
        </div>
        {hours === 0 && <p className="fine">{t.belowMin}</p>}
        <p className="fine">{t.note}</p>
        <Link
          className="btn btn-primary"
          href={`${demoHref}?pathway=B&band=${band}&r=${encodeRatings(ratings)}`}
          aria-disabled={hours === 0}
        >
          {t.tryDemo}
        </Link>
      </div>
    </div>
  );
}
