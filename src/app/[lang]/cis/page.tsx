import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDict, hasLocale } from "@/i18n";
import { CisCalculator } from "@/components/CisCalculator";

export async function generateMetadata({ params }: PageProps<"/[lang]/cis">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const d = getDict(lang);
  return { title: d.nav.cis, description: d.cisPage.lead, alternates: { canonical: `/${lang}/cis` } };
}

export default async function CisPage({ params }: PageProps<"/[lang]/cis">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const d = getDict(lang);
  return (
    <>
      <div className="wrap page-head">
        <div className="sec-head" style={{ marginBottom: 0 }}>
          <p className="eyebrow">{d.cisPage.eyebrow}</p>
          <h1>{d.cisPage.title}</h1>
          <p className="lead">{d.cisPage.lead}</p>
        </div>
      </div>
      <div className="wrap page-sec">
        <CisCalculator lang={lang} d={d} demoHref={`/${lang}/vi-cham-soc`} />
      </div>
    </>
  );
}
