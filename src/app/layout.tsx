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
    default: "INSUREGEN NEO — Family Care Wallet",
    template: "%s | INSUREGEN NEO",
  },
  description:
    "Family Care Wallet chi trả bằng dịch vụ chăm sóc thật khi cha hoặc mẹ tạm thời không thể chăm con vì lý do sức khỏe, thông qua đánh giá chức năng chăm sóc khách quan và mạng lưới đối tác dịch vụ.",
  keywords: [
    "bảo hiểm chăm sóc gia đình",
    "Family Care Wallet",
    "bảo hiểm cho gia đình có con nhỏ",
    "dịch vụ chăm sóc trẻ em",
    "INSUREGEN NEO",
  ],
  openGraph: {
    title: "INSUREGEN NEO — Family Care Wallet",
    description:
      "Chi trả bằng dịch vụ chăm sóc thật khi cha hoặc mẹ tạm thời không thể chăm con vì lý do sức khỏe.",
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
