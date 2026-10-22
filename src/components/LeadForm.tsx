"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import type { Dict, Locale } from "@/i18n";
import { validateLead, type LeadInput, type LeadField } from "@/lib/lead";

type Status = "idle" | "sending" | "done";

export function LeadForm({ lang, t }: { lang: Locale; t: Dict["lead"] }) {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Partial<Record<LeadField | "form", string>>>({});
  const [name, setName] = useState("");

  const msg = (code: string) => (t.errors as Record<string, string>)[code] ?? t.errors.server;

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const input: LeadInput = {
      name: String(fd.get("name") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      email: String(fd.get("email") ?? ""),
      fatherAge: fd.get("fatherAge") ? Number(fd.get("fatherAge")) : null,
      motherAge: fd.get("motherAge") ? Number(fd.get("motherAge")) : null,
      youngestChildAge: fd.get("childAge") ? Number(fd.get("childAge")) : null,
      city: String(fd.get("city") ?? "hcmc"),
      consent: fd.get("consent") === "on",
      locale: lang,
      website: String(fd.get("website") ?? ""),
    };
    const local = validateLead(input);
    if (local.length) {
      setErrors(Object.fromEntries(local.map((x) => [x.field, msg(x.code)])));
      const first = e.currentTarget.querySelector<HTMLElement>(`[name="${local[0].field === "youngestChildAge" ? "childAge" : local[0].field}"]`);
      first?.focus();
      return;
    }
    setErrors({});
    setStatus("sending");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (res.status === 429) throw new Error("rate");
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        if (Array.isArray(body.errors) && body.errors.length) {
          setErrors(Object.fromEntries(body.errors.map((x: { field: string; code: string }) => [x.field, msg(x.code)])));
          setStatus("idle");
          return;
        }
        throw new Error("server");
      }
      setName(input.name.trim().split(/\s+/).pop() ?? "");
      setStatus("done");
    } catch (err) {
      setErrors({ form: (err as Error).message === "rate" ? t.errors.rate : t.errors.server });
      setStatus("idle");
    }
  }

  if (status === "done") {
    return (
      <div className="form">
        <div className="success" role="status" tabIndex={-1}>
          <div className="ok-ico">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12 5 5 9-10" /></svg>
          </div>
          <h3>{t.successTitle.replace("{name}", name)}</h3>
          <p>{t.successBody}</p>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => setStatus("idle")}>{t.again}</button>
        </div>
      </div>
    );
  }

  const field = (id: LeadField) => ({
    "aria-invalid": errors[id] ? true : undefined,
    "aria-describedby": errors[id] ? `${id}-err` : undefined,
  });
  const err = (id: LeadField) => (errors[id] ? <p className="err" id={`${id}-err`}>{errors[id]}</p> : null);

  return (
    <div className="form">
      <form onSubmit={onSubmit} noValidate style={{ display: "grid", gap: 18 }} aria-describedby="lead-purpose">
        <p className="fine" id="lead-purpose">{t.purpose}</p>
        <div className="f">
          <label htmlFor="f-name">{t.name}</label>
          <input id="f-name" name="name" type="text" autoComplete="name" className="input" required aria-required="true" {...field("name")} />
          {err("name")}
        </div>
        <div className="row2">
          <div className="f">
            <label htmlFor="f-phone">{t.phone}</label>
            <input id="f-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="09xx xxx xxx" className="input" required aria-required="true" {...field("phone")} />
            {err("phone")}
          </div>
          <div className="f">
            <label htmlFor="f-email">{t.email} <span className="opt">({t.optional})</span></label>
            <input id="f-email" name="email" type="email" inputMode="email" autoComplete="email" className="input" {...field("email")} />
            {err("email")}
          </div>
        </div>
        <div className="row2">
          <div className="f">
            <label htmlFor="f-father">{t.fatherAge} <span className="opt">({t.optional})</span></label>
            <input id="f-father" name="fatherAge" type="number" inputMode="numeric" min={25} max={40} className="input" {...field("fatherAge")} />
            {err("fatherAge")}
          </div>
          <div className="f">
            <label htmlFor="f-mother">{t.motherAge} <span className="opt">({t.optional})</span></label>
            <input id="f-mother" name="motherAge" type="number" inputMode="numeric" min={25} max={40} className="input" {...field("motherAge")} />
            {err("motherAge")}
          </div>
        </div>
        <div className="row2">
          <div className="f">
            <label htmlFor="f-child">{t.childAge} <span className="opt">({t.optional})</span></label>
            <input id="f-child" name="childAge" type="number" inputMode="numeric" min={0} max={11} className="input" {...field("youngestChildAge")} />
            {err("youngestChildAge")}
          </div>
          <div className="f">
            <label htmlFor="f-city">{t.city} <span className="opt">({t.optional})</span></label>
            <select id="f-city" name="city" className="select" defaultValue="hcmc">
              {Object.entries(t.cities).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
        </div>
        <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}>
          <label htmlFor="f-website">Website</label>
          <input id="f-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>
        <label className="consent" htmlFor="f-consent">
          <input id="f-consent" name="consent" type="checkbox" {...field("consent")} />
          <span>{t.consent} <Link href={`/${lang}/chinh-sach-bao-mat`}>{t.privacy}</Link></span>
        </label>
        {err("consent")}
        {errors.form && <p className="err" role="alert">{errors.form}</p>}
        <button type="submit" className="btn btn-primary" disabled={status === "sending"}>
          {status === "sending" ? t.sending : t.submit}
        </button>
        <p className="fine">{t.note}</p>
      </form>
    </div>
  );
}
