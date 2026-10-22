import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDict, hasLocale, vnd, vndShort } from "@/i18n";
import { PricingCalculator } from "@/components/PricingCalculator";
import { CHILD_BANDS, LIFE, RIDER_RATES } from "@/lib/product";

export async function generateMetadata({ params }: PageProps<"/[lang]/tinh-phi">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const d = getDict(lang);
  return { title: d.nav.pricing, description: d.pricing.lead, alternates: { canonical: `/${lang}/tinh-phi` } };
}

export default async function PricingPage({ params }: PageProps<"/[lang]/tinh-phi">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const d = getDict(lang);
  const t = d.pricing;

  return (
    <>
      <div className="wrap page-head">
        <div className="sec-head" style={{ marginBottom: 0 }}>
          <p className="eyebrow">{t.eyebrow}</p>
          <h1>{t.title}</h1>
          <p className="lead">{t.lead}</p>
        </div>
      </div>
      <div className="wrap page-sec" style={{ display: "grid", gap: 32 }}>
        <PricingCalculator
          lang={lang}
          t={t}
          sumLabel={vndShort(lang, LIFE.sumAssured)}
          termYears={LIFE.termYears}
          adviserHref={`/${lang}#dang-ky`}
          basisHref={`/${lang}/co-so-dinh-phi`}
        />
        <div className="box">
          <h3>{t.riderTable}</h3>
          <div className="tbl-scroll" tabIndex={0}>
            <table className="tbl">
              <thead>
                <tr>
                  <th>{d.pricing.child}</th>
                  <th>{t.olderParent} 25–39</th>
                  <th>{t.olderParent} 40–49</th>
                </tr>
              </thead>
              <tbody>
                {CHILD_BANDS.map((b) => (
                  <tr key={b}>
                    <td>{b.replace("-", "–")}</td>
                    <td>{vnd(lang, RIDER_RATES["25-39"][b])}</td>
                    <td>{vnd(lang, RIDER_RATES["40-49"][b])}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="fine">{t.termNote}</p>
        </div>
      </div>
    </>
  );
}
