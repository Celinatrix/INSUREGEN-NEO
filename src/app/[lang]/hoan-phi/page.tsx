import { LegalView, legalMetadata } from "@/components/legal/LegalView";

export function generateMetadata({ params }: PageProps<"/[lang]/hoan-phi">) {
  return legalMetadata(params, "hoan-phi");
}

export default function Page({ params }: PageProps<"/[lang]/hoan-phi">) {
  return <LegalView params={params} slug="hoan-phi" />;
}
