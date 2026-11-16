"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Locale } from "@/i18n";
import { ACTUARIAL_T } from "@/i18n/actuarial";

export type DatasetSummary = {
  id: string;
  name: string;
  group: string;
  groupName: string;
  description: string;
  records: number;
  status: string;
  quality: string;
  qualityScore: number;
  version: string;
  updatedAt: string;
};

export function DatasetTable({ lang, datasets, groups }: { lang: Locale; datasets: DatasetSummary[]; groups: Record<string, string> }) {
  const t = ACTUARIAL_T[lang].center;
  const [q, setQ] = useState("");
  const [group, setGroup] = useState("all");
  const [quality, setQuality] = useState("all");
  const nf = lang === "vi" ? "vi-VN" : "en-US";

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return datasets.filter(
      (d) =>
        (group === "all" || d.group === group) &&
        (quality === "all" || d.quality === quality) &&
        (!needle || `${d.id} ${d.name} ${d.description}`.toLowerCase().includes(needle)),
    );
  }, [datasets, q, group, quality]);

  return (
    <>
      <div className="db-filters">
        <div className="field">
          <label htmlFor="db-q">{t.search}</label>
          <input id="db-q" className="input" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="DB31, mortality, reserve…" />
        </div>
        <div className="field">
          <label htmlFor="db-group">{t.group}</label>
          <select id="db-group" className="select" value={group} onChange={(e) => setGroup(e.target.value)}>
            <option value="all">{t.all}</option>
            {Object.entries(groups).map(([k, v]) => <option key={k} value={k}>{k} · {v}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="db-quality">{t.quality}</label>
          <select id="db-quality" className="select" value={quality} onChange={(e) => setQuality(e.target.value)}>
            <option value="all">{t.all}</option>
            {Object.entries(t.qualityLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
      </div>
      <div className="tbl-scroll">
        <table className="tbl db-table">
          <thead>
            <tr>
              <th>{t.cols.id}</th><th>{t.cols.name}</th><th>{t.cols.records}</th><th>{t.cols.status}</th>
              <th>{t.cols.quality}</th><th>{t.cols.score}</th><th>{t.cols.version}</th><th>{t.cols.updated}</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((d) => (
              <tr key={d.id}>
                <td><Link href={`/${lang}/actuarial/${d.id}`}>{d.id}</Link></td>
                <td><Link href={`/${lang}/actuarial/${d.id}`}>{d.name}</Link><span className="db-group">{d.group} · {d.groupName}</span></td>
                <td className="num">{d.records.toLocaleString(nf)}</td>
                <td><span className={`db-status db-${d.status}`}>{t.status[d.status as keyof typeof t.status] ?? d.status}</span></td>
                <td>{t.qualityLabels[d.quality as keyof typeof t.qualityLabels] ?? d.quality}</td>
                <td className="num">{d.qualityScore}</td>
                <td className="num">{d.version}</td>
                <td className="num">{new Date(d.updatedAt).toLocaleDateString(nf)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
