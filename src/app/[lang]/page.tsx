import { notFound } from "next/navigation";
import { commonVars, getDict, hasLocale, vnd } from "@/i18n";
import { Hero, Problem, WalletSection, Services, Why, Trust, Faq } from "@/components/landing/Static";
import { Continuum } from "@/components/landing/Continuum";
import { ClaimsStepper } from "@/components/landing/ClaimsStepper";
import { LeadForm } from "@/components/LeadForm";
import { hospitalCash, pathwayAHours } from "@/lib/rules";
import { RIDER } from "@/lib/product";

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const d = getDict(lang);
  const vars = commonVars(lang);
  const storyDays = 7;
  const story = {
    days: storyDays,
    hours: pathwayAHours(storyDays),
    cash: vnd(lang, hospitalCash(storyDays).amount),
    limit: RIDER.careHoursPerParentYear,
    used: 12,
  };

  return (
    <>
      <Hero lang={lang} d={d} />
      <Problem lang={lang} d={d} />
      <Continuum c={d.continuum} vars={vars} />
      <WalletSection lang={lang} d={d} />
      <Services d={d} />
      <ClaimsStepper c={d.claims} units={d.units} story={story} demoHref={`/${lang}/vi-cham-soc`} />
      <Why d={d} />
      <Trust lang={lang} d={d} />
      <Faq lang={lang} d={d} />
      <section className="final" id="dang-ky" aria-labelledby="final-title">
        <div className="wrap final-grid">
          <div className="sec-head" style={{ marginBottom: 0 }}>
            <p className="eyebrow">{d.lead.eyebrow}</p>
            <h2 id="final-title">{d.lead.title}</h2>
            <p className="lead">{d.lead.lead}</p>
          </div>
          <LeadForm lang={lang} t={d.lead} />
        </div>
      </section>
    </>
  );
}
