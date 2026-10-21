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
    default: "INSUREGEN NEO — Family Reconnect",
    template: "%s | INSUREGEN NEO",
  },
  description:
    "Family Reconnect bảo vệ cả cha và mẹ: 2 tỷ đồng khi tử vong hoặc thương tật toàn bộ vĩnh viễn, cùng trợ cấp nằm viện và Care Hours để thuê người trông con, nấu ăn, dọn nhà khi cha mẹ cần hồi phục.",
  keywords: [
    "bảo hiểm chăm sóc gia đình",
    "Family Reconnect",
    "Family Care Wallet",
    "bảo hiểm nhân thọ chung cho vợ chồng",
    "bảo hiểm cho gia đình có con nhỏ",
    "dịch vụ chăm sóc trẻ em",
    "INSUREGEN NEO",
  ],
  openGraph: {
    title: "INSUREGEN NEO — Family Reconnect",
    description:
      "Bảo vệ cả cha và mẹ, giữ nhịp sinh hoạt cho cả gia đình khi cha hoặc mẹ gặp vấn đề sức khỏe.",
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
