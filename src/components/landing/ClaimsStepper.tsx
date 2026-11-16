"use client";

import Link from "next/link";
import { useState } from "react";
import type { Dict } from "@/i18n";

type Story = { days: number; hours: number; cash: string; limit: number; childcareHours: number; schoolTrips: number };

const Doc = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--ok)" strokeWidth="2" aria-hidden="true">
    <path d="M6 3h8l4 4v14H6Z" />
    <path d="m9 14 2 2 4-4" />
  </svg>
);

const Tick = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m5 12 5 5 9-10" />
  </svg>
);
const Plus = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export function ClaimsStepper({ c, units, story, demoHref }: { c: Dict["claims"]; units: Dict["units"]; story: Story; demoHref: string }) {
  const [step, setStep] = useState(0);
  const p = c.phone;
  const fill = (s: string) =>
    s.replace("{cash}", story.cash).replace("{hours}", String(story.hours)).replace("{days}", String(story.days))
      .replace("{left}", String(story.limit - story.hours)).replace("{limit}", String(story.limit));
  // Bảng 3.4: 30 giờ trông trẻ + 5 chuyến đưa đón (2 Giờ chăm sóc/chuyến) dùng hết 40 giờ được cấp.
  const tripCredits = story.schoolTrips * 2;
  const left = story.hours - story.childcareHours - tripCredits;

  const screens = [
    <>
      <div className="app-h">{p.docs}</div>
      <div className="body">
        <div className="m-label">{p.who}</div>
        <div className="m-opt sel"><b>Minh</b><span style={{ marginLeft: "auto", display: "inline-flex" }}><Tick /></span></div>
        <div className="m-doc"><Doc /><span><b>{p.discharge}</b><br /><span className="m-label">{p.photo}</span></span></div>
        <div className="m-doc"><Doc /><span><b>{p.questionnaire}</b><br /><span className="m-label">{p.completed}</span></span></div>
        <div className="m-doc" style={{ justifyContent: "center" }}><Plus />{p.addPhoto}</div>
        <p className="m-label" style={{ fontWeight: 400 }}>{p.privacy}</p>
        <div className="m-btn">{p.submit}</div>
      </div>
    </>,
    <>
      <div className="app-h">{p.verify}</div>
      <div className="body">
        <div className="m-card"><div className="m-row"><span>{p.hospital}</span><b>{p.hospitalName}</b></div></div>
        <div className="m-card"><div className="m-row"><span>{p.daysAdmitted}</span><b className="num">{story.days} {units.days}</b></div></div>
        <div className="m-card"><div className="m-row"><span>{p.datesMatch}</span><span style={{ color: "var(--ok)" }}><Tick /></span></div></div>
        <div className="m-card"><div className="m-row"><span>{p.waiting}</span><span style={{ color: "var(--ok)" }}><Tick /></span></div></div>
        <div className="m-card"><div className="m-row"><span>{p.flags}</span><b>0</b></div></div>
      </div>
    </>,
    <>
      <div className="app-h">{p.record}</div>
      <div className="body">
        <div className="m-card"><div className="m-row"><span>{p.policy}</span><span style={{ color: "var(--ok)", fontWeight: 600 }}>{p.inForce}</span></div></div>
        <div className="m-card"><div className="m-row"><span>{p.pathway}</span><b>{p.inHospital}</b></div></div>
        <div className="m-card navy"><div className="m-label">{p.tier}</div><div style={{ fontSize: 15, marginTop: 4 }}>{p.tierValue}</div></div>
        <p className="m-label" style={{ fontWeight: 400 }}>{fill(p.remainingYear)}</p>
      </div>
    </>,
    <>
      <div className="app-h">{p.wallet}</div>
      <div className="body">
        <span className="m-ok"><Tick />{p.approved}</span>
        <div className="m-card navy">
          <div className="m-label">{p.careHours}</div>
          <div className="m-big">{story.hours}<span style={{ fontSize: 15, fontFamily: "var(--font-ui)" }}> {units.hours}</span></div>
          <div className="m-meter"><span style={{ width: `${(story.hours / story.limit) * 100}%` }} /></div>
        </div>
        <div className="m-card"><div className="m-row"><span>{p.cash}</span><b className="num">{story.cash}</b></div></div>
        <div className="m-btn">{p.book}</div>
      </div>
    </>,
    <>
      <div className="app-h">{p.plan}</div>
      <div className="body">
        <div className="m-card navy">
          <div className="m-row"><span className="m-label">{p.remaining}</span><b className="num">{left}/{story.hours} {units.hours}</b></div>
          <div className="m-meter"><span style={{ width: `${(left / story.hours) * 100}%` }} /></div>
        </div>
        <div className="m-card">
          <div className="m-row"><b>{p.childcareHome}</b><span className="num">{story.childcareHours} {units.hours}</span></div>
          <div className="m-label" style={{ fontWeight: 400 }}>{p.contracted}</div>
        </div>
        <div className="m-card">
          <div className="m-row"><b>{p.pickup}</b><span className="num">{story.schoolTrips} {units.trips}</span></div>
          <div className="m-label" style={{ fontWeight: 400 }}>{p.pickupWho}</div>
        </div>
      </div>
    </>,
  ];

  return (
    <section className="sec-alt defer" id="boi-thuong" aria-labelledby="claims-title">
      <div className="wrap claims-grid">
        <div>
          <div className="sec-head" style={{ marginBottom: 24 }}>
            <p className="eyebrow">{c.eyebrow}</p>
            <h2 id="claims-title">{c.title}</h2>
            <p className="lead">{c.lead}</p>
          </div>
          <div className="progress" aria-hidden="true"><span style={{ transform: `scaleX(${(step + 1) / c.steps.length})` }} /></div>
          <ol className="steps">
            {c.steps.map((s, i) => (
              <li key={s.t}>
                <button
                  type="button"
                  className={`step-btn${i < step ? " done" : ""}`}
                  aria-current={i === step ? "step" : undefined}
                  onClick={() => setStep(i)}
                >
                  <span className="n">{i + 1}</span>
                  <span><span className="t">{s.t}</span><span className="d">{fill(s.d)}</span></span>
                </button>
              </li>
            ))}
          </ol>
          <div className="step-nav">
            <button type="button" className="btn btn-ghost btn-sm" disabled={step === 0} onClick={() => setStep((s) => Math.max(0, s - 1))}>{c.prev}</button>
            <button type="button" className="btn btn-primary btn-sm" disabled={step === c.steps.length - 1} onClick={() => setStep((s) => Math.min(c.steps.length - 1, s + 1))}>{c.next}</button>
            <Link className="btn btn-ghost btn-sm" href={demoHref}>{c.tryIt}</Link>
          </div>
        </div>
        <div className="phone" role="img" aria-label={p.wallet}>
          <div className="screen">
            <div className="bar"><span>9:41</span><span>5G ▮▮▮</span></div>
            <div className="scr on" key={step}>{screens[step]}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
