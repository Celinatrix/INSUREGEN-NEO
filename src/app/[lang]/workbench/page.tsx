import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n";
import { ACTUARIAL_T } from "@/i18n/actuarial";
import { store } from "@/lib/actuarial-db/server";
import { basisFrom, treatiesFrom } from "@/lib/actuarial-db/run";
import { Workbench } from "@/components/actuarial/Workbench";

export async function generateMetadata({ params }: PageProps<"/[lang]/workbench">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = ACTUARIAL_T[lang].wb;
  return { title: t.eyebrow, description: t.lead, alternates: { canonical: `/${lang}/workbench` } };
}

export default async function WorkbenchPage({ params }: PageProps<"/[lang]/workbench">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = ACTUARIAL_T[lang];
  const s = store();
  const basis = basisFrom(s);
  const selected = treatiesFrom(s).find((x) => x.selected)?.treaty;
  const riderRates = s.rows("DB53").map((r) => ({ parentBand: String(r.parent_band), childBand: String(r.child_band), tariff: Number(r.tariff) }));

  return (
    <>
      <section className="page-head">
        <div className="wrap sec-head" style={{ marginBottom: 0 }}>
          <p className="eyebrow"><Link href={`/${lang}/actuarial`}>{t.navCenter}</Link> · {t.wb.eyebrow}</p>
          <h1>{t.wb.title}</h1>
          <p className="lead">{t.wb.lead}</p>
        </div>
      </section>
      <section className="page-sec">
        <div className="wrap">
          <Workbench
            lang={lang}
            defaults={{
              fatherAge: 40,
              motherAge: 40,
              childAge: 3,
              sumAssured: basis.sumAssured,
              termYears: basis.termYears,
              pricingRate: basis.pricingRate,
              valuationRate: basis.valuationRate,
              tpdUplift: basis.tpdUplift,
              mortalityMultiplier: basis.mortalityMultiplier,
              tpdMultiplier: basis.tpdMultiplier,
              dependenceShare: basis.dependence.share,
              claimHandling: basis.claimHandling,
              reinsurance: basis.reinsurance,
              riskMargin: basis.riskMargin,
              profit: basis.profit,
              adminPerYear: basis.adminPerYear,
              acquisition: basis.acquisition,
              commission1: basis.commission[0],
              commission2: basis.commission[1],
              commission3: basis.commission[2],
              cededShare: selected?.cededShare ?? 0.6,
            }}
            riderRates={riderRates}
          />
        </div>
      </section>
    </>
  );
}
