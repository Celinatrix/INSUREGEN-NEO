"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import type { Locale } from "@/i18n";
import { ACTUARIAL_T } from "@/i18n/actuarial";

export function ImportForm({ lang, id }: { lang: Locale; id: string }) {
  const t = ACTUARIAL_T[lang].detail;
  const router = useRouter();
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const file = (e.currentTarget.elements.namedItem("file") as HTMLInputElement).files?.[0];
    if (!file) return;
    setBusy(true);
    const csv = file.name.toLowerCase().endsWith(".csv");
    const res = await fetch(`/api/actuarial/datasets/${id}`, {
      method: "POST",
      headers: { "Content-Type": csv ? "text/csv" : "application/json" },
      body: await file.text(),
    }).catch(() => null);
    setBusy(false);
    const j = res ? await res.json().catch(() => ({})) : {};
    if (res?.ok) {
      setMsg({ ok: true, text: `OK · ${j.version}` });
      router.refresh();
    } else {
      const first = (j.issues ?? []).slice(0, 5).map((i: { row: number; message: string }) => `#${i.row + 1}: ${i.message}`).join(" · ");
      setMsg({ ok: false, text: `${j.error ?? `${(j.issues ?? []).length}`} ${first}` });
    }
  }

  return (
    <form className="box" onSubmit={submit}>
      <h2 className="box-title">{t.import}</h2>
      <p className="fine">{t.importNote}</p>
      <input name="file" type="file" accept=".csv,.json,text/csv,application/json" className="input" required />
      <button type="submit" className="btn btn-primary btn-sm" disabled={busy} style={{ justifySelf: "start" }}>{t.importBtn}</button>
      {msg && <p className={`notice ${msg.ok ? "ok" : "warn"}`} role="status">{msg.text}</p>}
    </form>
  );
}
