import { LegalView, legalMetadata } from "@/components/legal/LegalView";

export function generateMetadata({ params }: PageProps<"/[lang]/chinh-sach-bao-mat">) {
  return legalMetadata(params, "chinh-sach-bao-mat");
}

export default function Page({ params }: PageProps<"/[lang]/chinh-sach-bao-mat">) {
  return <LegalView params={params} slug="chinh-sach-bao-mat" />;
}
