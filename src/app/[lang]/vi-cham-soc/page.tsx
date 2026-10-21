import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getDict, hasLocale } from "@/i18n";
import { DemoWallet } from "@/components/DemoWallet";

export async function generateMetadata({ params }: PageProps<"/[lang]/vi-cham-soc">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const d = getDict(lang);
  return { title: d.nav.demo, description: d.demo.lead, alternates: { canonical: `/${lang}/vi-cham-soc` } };
}

export default async function DemoPage({ params }: PageProps<"/[lang]/vi-cham-soc">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const d = getDict(lang);
  const t = { demo: d.demo, activities: d.activities, severity: d.severity, services: d.services.names, units: d.units };
  return (
    <>
      <div className="wrap page-head">
        <div className="sec-head" style={{ marginBottom: 0 }}>
          <p className="eyebrow">{d.demo.eyebrow}</p>
          <h1>{d.demo.title}</h1>
          <p className="lead">{d.demo.lead}</p>
        </div>
      </div>
      <div className="wrap page-sec">
        <Suspense fallback={<p className="notice">{d.demo.loading}</p>}>
          <DemoWallet lang={lang} t={t} />
        </Suspense>
      </div>
    </>
  );
}
