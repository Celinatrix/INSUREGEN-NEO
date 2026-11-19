import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LOCALES, getDict, hasLocale } from "@/i18n";
import "../globals.css";

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const d = getDict(lang);
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: d.meta.title, template: `%s | Family Reconnect` },
    description: d.meta.description,
    alternates: { canonical: `/${lang}`, languages: { vi: "/vi", en: "/en" } },
    openGraph: {
      title: d.meta.title,
      description: d.meta.description,
      locale: lang === "vi" ? "vi_VN" : "en_US",
      type: "website",
      siteName: "Family Reconnect",
    },
  };
}

export const viewport: Viewport = {
  viewportFit: "cover",
  themeColor: "#F7F8FA",
};

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const d = getDict(lang);
  // Đọc header khiến trang render theo từng request, để Next.js gắn nonce CSP (xem src/proxy.ts) vào script của nó.
  await headers();
  return (
    <html lang={lang}>
      <body>
        <a className="skip" href="#main">{d.nav.skip}</a>
        <Header lang={lang} nav={d.nav} />
        <main id="main">{children}</main>
        <Footer lang={lang} footer={d.footer} />
      </body>
    </html>
  );
}
