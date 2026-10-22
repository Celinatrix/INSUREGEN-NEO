import Link from "next/link";
import type { Dict, Locale } from "@/i18n";
import { CONTACT_EMAIL } from "@/i18n/legal";
import { BrandMark } from "./BrandMark";

export function Footer({ lang, footer }: { lang: Locale; footer: Dict["footer"] }) {
  const home = `/${lang}`;
  const links = [
    { href: `${home}/chinh-sach-bao-mat`, label: footer.links.privacy },
    { href: `${home}/dieu-khoan`, label: footer.links.terms },
    { href: `${home}/cookie`, label: footer.links.cookie },
    { href: `${home}/hoan-phi`, label: footer.links.refund },
    { href: `${home}#minh-bach`, label: footer.links.excl },
    { href: `${home}#hoi-dap`, label: footer.links.faq },
  ];
  const [before, after] = footer.contact.split("{email}");
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="foot">
          <div style={{ display: "grid", gap: 10 }}>
            <Link className="brand" href={home}>
              <BrandMark size={28} />
              <span>Family Reconnect</span>
            </Link>
            <p className="fine">{footer.tagline}</p>
            <p className="fine">{footer.team}</p>
            <p className="fine">
              {before}
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
              {after}
            </p>
          </div>
          <nav aria-label={footer.legalNav}>
            <ul>
              {links.map((l) => (
                <li key={l.href}><Link href={l.href}>{l.label}</Link></li>
              ))}
            </ul>
          </nav>
        </div>
        <p className="disclaimer">{footer.disclaimer}</p>
      </div>
    </footer>
  );
}
