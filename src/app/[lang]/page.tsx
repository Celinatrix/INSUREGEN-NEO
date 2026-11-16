import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { homeJsonLd, jsonLdScript } from "@/lib/agent/jsonld";
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
  // JSON-LD cho agent và công cụ tìm kiếm; origin lấy từ request để đúng cả khi chưa đặt NEXT_PUBLIC_SITE_URL.
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? `${proto}://${host}`;
  const nonce = h.get("x-nonce") ?? undefined;
  // Bảng 3.4: bố nằm viện 8 ngày → 40 Giờ chăm sóc và 4.000.000đ; dùng 30 giờ trông trẻ + 5 chuyến đưa đón.
  const storyDays = 8;
  const story = {
    days: storyDays,
    hours: pathwayAHours(storyDays),
    cash: vnd(lang, hospitalCash(storyDays).amount),
    limit: RIDER.careHoursPerParentYear,
    childcareHours: 30,
    schoolTrips: 5,
  };

  return (
    <>
      <script type="application/ld+json" nonce={nonce} dangerouslySetInnerHTML={{ __html: jsonLdScript(homeJsonLd(lang, origin)) }} />
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
