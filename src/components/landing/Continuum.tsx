"use client";

import { useState } from "react";
import type { Dict } from "@/i18n";

type Vars = Record<string, string | number>;
const fill = (s: string, v: Vars) => s.replace(/\{(\w+)\}/g, (_, k) => String(v[k] ?? `{${k}}`));

// Phần nào đang bảo vệ ở mỗi tình huống: 0 nằm viện, 1 hồi phục tại nhà, 2 TTTBVV, 3 tử vong
const ACTIVE: Record<number, ("life" | "rider" | "limits")[]> = {
  0: ["rider", "limits"],
  1: ["rider", "limits"],
  2: ["life"],
  3: ["life"],
};

export function Continuum({ c, vars }: { c: Dict["continuum"]; vars: Vars }) {
  const [stage, setStage] = useState(0);
  const on = (k: "life" | "rider" | "limits") => ACTIVE[stage].includes(k);

  const layers = [
    {
      key: "life" as const,
      kicker: fill(c.life.kicker, vars),
      title: c.life.title,
      text: stage === 2 ? c.life.tpd : stage === 3 ? c.life.death : c.life.idle,
    },
    {
      key: "rider" as const,
      kicker: c.rider.kicker,
      title: "Family Continuity Rider",
      text: stage === 0 ? c.rider.a : stage === 1 ? c.rider.b : c.rider.end,
    },
    {
      key: "limits" as const,
      kicker: c.limits.kicker,
      title: c.limits.title,
      text: stage <= 1 ? c.limits.on : c.limits.off,
    },
  ];

  return (
    <section id="bao-ve" aria-labelledby="cont-title">
      <div className="wrap">
        <div className="sec-head">
          <p className="eyebrow">{c.eyebrow}</p>
          <h2 id="cont-title">{c.title}</h2>
          <p className="lead">{c.lead}</p>
        </div>
        <div className="continuum">
          <div className="scale" role="group">
            {c.stages.map((s, i) => (
              <button
                key={s.name}
                type="button"
                className="stage"
                aria-pressed={stage === i}
                aria-controls="layers"
                onClick={() => setStage(i)}
              >
                <span className="dot">{i + 1}</span>
                <span className="s-name">{s.name}</span>
                <span className="s-eg">{fill(s.eg, vars)}</span>
              </button>
            ))}
          </div>
          <div className="layers" id="layers" aria-live="polite">
            {layers.map((l) => (
              <article key={l.key} className={`layer${on(l.key) ? " active" : ""}`}>
                <div className="l-top">
                  <span className="l-kicker">{l.kicker}</span>
                  <span className="state">{on(l.key) ? c.on : c.off}</span>
                </div>
                <h3>{l.title}</h3>
                <p className="l-what">{fill(l.text, vars)}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
