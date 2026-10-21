"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import type { Dict, Locale } from "@/i18n";
import { ACTIVITIES, CHILD_BANDS, CREDITS_PER_SERVICE_HOUR, SERVICES, childBandFor, type ChildBand, type Service, type Severity } from "@/lib/product";
import type { Ratings } from "@/lib/rules";

type T = {
  demo: Dict["demo"];
  activities: Dict["activities"];
  severity: Dict["severity"];
  services: Dict["services"]["names"];
  units: Dict["units"];
};

type Claim = {
  id: string;
  parent: "father" | "mother";
  pathway: "A" | "B";
  inpatient_days: number | null;
  cis_score: number | null;
  hours_awarded: number;
  cash_amount: number;
  status: "approved" | "review" | "rejected";
  reasons: string[];
  flags: string[];
  created_at: string;
};
type GrantView = { id: string; kind: "claim" | "gift"; parent: "father" | "mother" | null; hours: number; remaining: number; services: Service[]; created_at: string };
type Booking = { id: string; service: Service; service_hours: number; credits: number; service_date: string; created_at: string };
type Wallet = {
  id: string;
  youngestChildAge: number;
  balance: number;
  cashPaid: number;
  limitLeft: { father: number; mother: number };
  claims: Claim[];
  grants: GrantView[];
  bookings: Booking[];
  storage: "supabase" | "memory";
};

const LEVELS: Severity[] = ["F0", "F1", "F2", "F3"];
const KEY = "fr-wallet";
const BAND_AGE: Record<ChildBand, number> = { "0-2": 1, "3-5": 4, "6-8": 7, "9-12": 10 };

const money = (l: Locale, v: number) =>
  l === "vi" ? `${Math.round(v).toLocaleString("vi-VN")}đ` : `VND ${Math.round(v).toLocaleString("en-US")}`;
const fill = (s: string, v: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (_, k) => String(v[k] ?? ""));
const todayStr = () => new Date().toISOString().slice(0, 10);
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString().slice(0, 10);

function decodeRatings(r: string | null): Ratings | null {
  if (!r || !/^[0-3]{6}$/.test(r)) return null;
  return Object.fromEntries(ACTIVITIES.map((a, i) => [a, `F${r[i]}`])) as Ratings;
}

export function DemoWallet({ lang, t }: { lang: Locale; t: T }) {
  const d = t.demo;
  const sp = useSearchParams();
  const qBand = sp.get("band") as ChildBand | null;
  const qRatings = decodeRatings(sp.get("r"));

  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loadError, setLoadError] = useState("");
  const [parent, setParent] = useState<"father" | "mother">("father");
  const [pathway, setPathway] = useState<"A" | "B">(sp.get("pathway") === "B" ? "B" : "A");
  const [reason, setReason] = useState<"illness" | "injury" | "pregnancy">("injury");
  const [admit, setAdmit] = useState(daysAgo(8));
  const [discharge, setDischarge] = useState(daysAgo(1));
  const [icu, setIcu] = useState(0);
  const [ratings, setRatings] = useState<Ratings>(qRatings ?? { C1: "F3", C2: "F1", C3: "F2", C4: "F3", C5: "F0", C6: "F1" });
  const [restrictedDays, setRestrictedDays] = useState(5);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Claim | null>(null);
  const [extractMsg, setExtractMsg] = useState<{ kind: "ok" | "warn" | ""; text: string }>({ kind: "", text: "" });
  const [service, setService] = useState<Service>("childcare");
  const [serviceHours, setServiceHours] = useState(4);
  const [serviceDate, setServiceDate] = useState(todayStr());
  const [bookMsg, setBookMsg] = useState<{ kind: "ok" | "warn"; text: string } | null>(null);
  const started = useRef(false);

  const create = useCallback(async (age: number) => {
    const res = await fetch("/api/wallets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ youngestChildAge: age }),
    });
    if (!res.ok) throw new Error("create");
    const w: Wallet = await res.json();
    try {
      localStorage.setItem(KEY, w.id);
    } catch {}
    setWallet(w);
    setResult(null);
    setBookMsg(null);
  }, []);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    (async () => {
      try {
        let id: string | null = null;
        try {
          id = localStorage.getItem(KEY);
        } catch {}
        if (id) {
          const res = await fetch(`/api/wallets/${id}`);
          if (res.ok) {
            const w: Wallet = await res.json();
            if (qBand && CHILD_BANDS.includes(qBand) && childBandFor(w.youngestChildAge) !== qBand) {
              await create(BAND_AGE[qBand]);
            } else setWallet(w);
            return;
          }
        }
        await create(qBand && CHILD_BANDS.includes(qBand) ? BAND_AGE[qBand] : 3);
      } catch {
        setLoadError(lang === "vi" ? "Chưa kết nối được máy chủ. Tải lại trang để thử lại." : "Couldn't reach the server. Reload to try again.");
      }
    })();
  }, [create, lang, qBand]);

  async function onUpload(file: File) {
    setExtractMsg({ kind: "", text: d.reading });
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/claims/extract", { method: "POST", body: fd }).catch(() => null);
    if (!res) return setExtractMsg({ kind: "warn", text: d.readFail });
    if (res.status === 501) return setExtractMsg({ kind: "warn", text: d.readUnavailable });
    const j = await res.json().catch(() => ({}));
    if (!res.ok) return setExtractMsg({ kind: "warn", text: d.readFail });
    setAdmit(j.admissionDate);
    setDischarge(j.dischargeDate);
    setIcu(j.icuHours ?? 0);
    setExtractMsg({
      kind: "ok",
      text: fill(d.readOk, { admit: j.admissionDate, discharge: j.dischargeDate, icu: j.icuHours ? ` · ICU ${j.icuHours}h` : "" }),
    });
  }

  async function submitClaim(e: FormEvent) {
    e.preventDefault();
    if (!wallet) return;
    setBusy(true);
    const body =
      pathway === "A"
        ? { parent, pathway, reason, admissionDate: admit, dischargeDate: discharge, icuHours: icu }
        : { parent, pathway, reason, ratings, restrictedDays };
    const res = await fetch(`/api/wallets/${wallet.id}/claims`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).catch(() => null);
    setBusy(false);
    if (!res || !res.ok) {
      setResult(null);
      setLoadError(d.readFail);
      return;
    }
    const j = await res.json();
    setWallet(j.wallet);
    setResult(j.claim);
  }

  async function submitBooking(e: FormEvent) {
    e.preventDefault();
    if (!wallet) return;
    const res = await fetch(`/api/wallets/${wallet.id}/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ service, serviceHours, serviceDate }),
    }).catch(() => null);
    const j = res ? await res.json().catch(() => ({})) : {};
    if (!res || !res.ok) {
      setBookMsg({ kind: "warn", text: (d.bookErrors as Record<string, string>)[j.error] ?? d.bookErrors.invalid_hours });
      return;
    }
    setWallet(j.wallet);
    setBookMsg({
      kind: "ok",
      text: fill(d.booked, { service: t.services[service].toLowerCase(), h: serviceHours, n: j.booking.credits }),
    });
  }

  const history = useMemo(() => {
    if (!wallet) return [];
    const items: { at: string; title: string; sub: string; delta: string; plus: boolean }[] = [];
    for (const g of wallet.grants) {
      items.push({
        at: g.created_at,
        title: g.kind === "gift" || !g.parent ? d.gift : `${d.grant} · ${d.parents[g.parent]}`,
        sub: g.services.map((s) => t.services[s]).join(", "),
        delta: `+${g.hours}`,
        plus: true,
      });
    }
    for (const b of wallet.bookings) {
      items.push({
        at: b.created_at,
        title: `${d.booking} · ${t.services[b.service]}`,
        sub: `${b.service_date} · ${b.service_hours} ${t.units.hours}`,
        delta: `−${b.credits}`,
        plus: false,
      });
    }
    return items.sort((a, b) => b.at.localeCompare(a.at));
  }, [wallet, d, t]);

  if (loadError && !wallet) return <p className="notice warn">{loadError}</p>;
  if (!wallet) return <p className="notice">{d.loading}</p>;

  const band = childBandFor(wallet.youngestChildAge);
  const cost = serviceHours * CREDITS_PER_SERVICE_HOUR[service];
  const nf = lang === "vi" ? "vi-VN" : "en-US";

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <div className="kpis">
        <div className="kpi"><span>{d.balance}</span><b>{wallet.balance} {t.units.hours}</b></div>
        <div className="kpi"><span>{d.cashPaid}</span><b>{money(lang, wallet.cashPaid)}</b></div>
        <div className="kpi">
          <span>{d.limitLeft}</span>
          <b>{wallet.limitLeft.father} · {wallet.limitLeft.mother}</b>
          <span>{d.parents.father} · {d.parents.mother}</span>
        </div>
      </div>

      <div className="demo-grid">
        <div style={{ display: "grid", gap: 20 }}>
          <form className="box" onSubmit={submitClaim}>
            <h3>{d.newClaim}</h3>
            <div className="field">
              <span className="flabel" id="who-l">{d.who}</span>
              <div className="seg" role="group" aria-labelledby="who-l">
                {(["father", "mother"] as const).map((p) => (
                  <button key={p} type="button" aria-pressed={parent === p} onClick={() => setParent(p)}>{d.parents[p]}</button>
                ))}
              </div>
            </div>
            <div className="field">
              <span className="flabel" id="path-l">{d.pathway}</span>
              <div className="seg" role="group" aria-labelledby="path-l">
                <button type="button" aria-pressed={pathway === "A"} onClick={() => setPathway("A")}>{d.pathA}</button>
                <button type="button" aria-pressed={pathway === "B"} onClick={() => setPathway("B")}>{d.pathB}</button>
              </div>
            </div>
            <div className="field">
              <label htmlFor="reason">{d.reason}</label>
              <select id="reason" className="select" value={reason} onChange={(e) => setReason(e.target.value as typeof reason)}>
                {Object.entries(d.reasons).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>

            {pathway === "A" ? (
              <>
                <div className="field">
                  <label htmlFor="doc">{d.upload}</label>
                  <input id="doc" type="file" accept="image/jpeg,image/png,image/webp" className="input"
                    onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])} />
                  <p className="fine">{d.uploadHelp}</p>
                  {extractMsg.text && <p className={`notice ${extractMsg.kind}`} role="status">{extractMsg.text}</p>}
                </div>
                <div className="row2">
                  <div className="field">
                    <label htmlFor="admit">{d.admit}</label>
                    <input id="admit" type="date" className="input" value={admit} onChange={(e) => setAdmit(e.target.value)} />
                  </div>
                  <div className="field">
                    <label htmlFor="discharge">{d.discharge}</label>
                    <input id="discharge" type="date" className="input" value={discharge} onChange={(e) => setDischarge(e.target.value)} />
                  </div>
                </div>
                <div className="field">
                  <label htmlFor="icu">{d.icu}</label>
                  <input id="icu" type="number" min={0} className="input" value={icu} onChange={(e) => setIcu(Math.max(0, Number(e.target.value) || 0))} />
                </div>
              </>
            ) : (
              <>
                <div className="field">
                  <span className="flabel">{d.ratings} · {d.childAge} {band.replace("-", "–")}</span>
                  {ACTIVITIES.map((a) => (
                    <div className="rate-row" key={a}>
                      <span className="r-name">{a} · {t.activities[a]}</span>
                      <div className="seg" role="group" aria-label={`${a} ${t.activities[a]}`}>
                        {LEVELS.map((lv) => (
                          <button key={lv} type="button" title={t.severity[lv]} aria-pressed={ratings[a] === lv}
                            onClick={() => setRatings((r) => ({ ...r, [a]: lv }))}>{lv}</button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="field">
                  <label htmlFor="rdays">{d.restrictedDays}</label>
                  <input id="rdays" type="number" min={0} className="input" value={restrictedDays}
                    onChange={(e) => setRestrictedDays(Math.max(0, Number(e.target.value) || 0))} />
                </div>
              </>
            )}
            <button type="submit" className="btn btn-primary" disabled={busy}>{busy ? d.submitting : d.submit}</button>

            {result && (
              <div className="notice" role="status" style={{ display: "grid", gap: 6 }}>
                <span className={`status ${result.status}`}>{d.status[result.status]}</span>
                {result.status !== "rejected" && (
                  <b>{fill(result.pathway === "A" ? d.awarded : d.awardedHours, { hours: result.hours_awarded, cash: money(lang, result.cash_amount) })}</b>
                )}
                <span>
                  {result.pathway === "A" && result.inpatient_days !== null && fill(d.days, { n: result.inpatient_days })}
                  {result.pathway === "B" && result.cis_score !== null &&
                    fill(d.score, { s: result.cis_score.toLocaleString(nf, { minimumFractionDigits: 2, maximumFractionDigits: 3 }) })}
                </span>
                {[...result.reasons, ...result.flags].map((r) => (
                  <span key={r}>{(d.reasonsOut as Record<string, string>)[r] ?? r}</span>
                ))}
              </div>
            )}
          </form>

          <form className="box" onSubmit={submitBooking}>
            <h3>{d.book}</h3>
            <div className="row2">
              <div className="field">
                <label htmlFor="svc">{d.service}</label>
                <select id="svc" className="select" value={service} onChange={(e) => setService(e.target.value as Service)}>
                  {SERVICES.map((s) => <option key={s} value={s}>{t.services[s]}</option>)}
                </select>
              </div>
              <div className="field">
                <label htmlFor="shours">{d.serviceHours}</label>
                <input id="shours" type="number" min={1} max={24} className="input" value={serviceHours}
                  onChange={(e) => setServiceHours(Math.max(1, Math.min(24, Math.floor(Number(e.target.value) || 1))))} />
              </div>
            </div>
            <div className="field">
              <label htmlFor="sdate">{d.date}</label>
              <input id="sdate" type="date" className="input" value={serviceDate} onChange={(e) => setServiceDate(e.target.value)} />
            </div>
            <p className="fine">{fill(d.cost, { n: cost })}</p>
            <button type="submit" className="btn btn-primary">{d.bookIt}</button>
            {bookMsg && <p className={`notice ${bookMsg.kind}`} role="status">{bookMsg.text}</p>}
          </form>
        </div>

        <div className="box">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <h3>{d.history}</h3>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => create(wallet.youngestChildAge)}>{d.reset}</button>
          </div>
          {history.length === 0 ? (
            <p className="fine">{d.empty}</p>
          ) : (
            <ul className="ledger">
              {history.map((h, i) => (
                <li key={i}>
                  <span>{h.title}</span>
                  <span className={h.plus ? "plus" : "minus"}>{h.delta}</span>
                  <span className="l-sub">{h.sub}</span>
                </li>
              ))}
            </ul>
          )}
          <p className="fine">{fill(d.storageNote, { where: wallet.storage === "supabase" ? d.storageDb : d.storageMemory })}</p>
        </div>
      </div>
    </div>
  );
}
