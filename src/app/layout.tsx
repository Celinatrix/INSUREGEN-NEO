import type { Metadata } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "INSUREGEN NEO — Bảo hiểm số thế hệ mới",
    template: "%s | INSUREGEN NEO",
  },
  description:
    "INSUREGEN NEO cung cấp giải pháp bảo hiểm sức khỏe, nhân thọ, xe cơ giới, nhà ở, du lịch và doanh nghiệp với công nghệ bồi thường số hóa và mạng lưới bảo lãnh viện phí toàn quốc.",
  keywords: [
    "bảo hiểm",
    "bảo hiểm sức khỏe",
    "bảo hiểm nhân thọ",
    "bảo hiểm xe cơ giới",
    "INSUREGEN NEO",
  ],
  openGraph: {
    title: "INSUREGEN NEO — Bảo hiểm số thế hệ mới",
    description:
      "Giải pháp bảo hiểm toàn diện cho cá nhân, gia đình và doanh nghiệp với công nghệ bồi thường số hóa.",
    locale: "vi_VN",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi" className={`${ibmPlexSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
