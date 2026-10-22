import { LegalView, legalMetadata } from "@/components/legal/LegalView";

export function generateMetadata({ params }: PageProps<"/[lang]/dieu-khoan">) {
  return legalMetadata(params, "dieu-khoan");
}

export default function Page({ params }: PageProps<"/[lang]/dieu-khoan">) {
  return <LegalView params={params} slug="dieu-khoan" />;
}
