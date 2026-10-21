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
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F7F8FA" },
    { media: "(prefers-color-scheme: dark)", color: "#0D1525" },
  ],
};

// Áp dụng giao diện sáng/tối đã lưu trước khi trang hiển thị, tránh nháy màu.
const themeScript = `try{var t=localStorage.getItem('fr-theme');if(t==='dark'||t==='light')document.documentElement.dataset.theme=t}catch(e){}`;

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const d = getDict(lang);
  // Nonce do proxy tạo cho lượt tải này (xem src/proxy.ts); đọc header khiến trang render theo từng request.
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        <script nonce={nonce} dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <a className="skip" href="#main">{d.nav.skip}</a>
        <Header lang={lang} nav={d.nav} />
        <main id="main">{children}</main>
        <Footer lang={lang} footer={d.footer} />
      </body>
    </html>
  );
}
