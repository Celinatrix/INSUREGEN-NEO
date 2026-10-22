import { LegalView, legalMetadata } from "@/components/legal/LegalView";

export function generateMetadata({ params }: PageProps<"/[lang]/cookie">) {
  return legalMetadata(params, "cookie");
}

export default function Page({ params }: PageProps<"/[lang]/cookie">) {
  return <LegalView params={params} slug="cookie" />;
}
