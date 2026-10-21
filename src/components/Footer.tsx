import Link from "next/link";
import type { Dict, Locale } from "@/i18n";
import { BrandMark } from "./BrandMark";

export function Footer({ lang, footer }: { lang: Locale; footer: Dict["footer"] }) {
  const home = `/${lang}`;
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
          </div>
          <nav aria-label={footer.links.terms}>
            <ul>
              <li><Link href={`${home}#minh-bach`}>{footer.links.terms}</Link></li>
              <li><Link href={`${home}#minh-bach`}>{footer.links.data}</Link></li>
              <li><Link href={`${home}#minh-bach`}>{footer.links.excl}</Link></li>
              <li><Link href={`${home}#hoi-dap`}>{footer.links.faq}</Link></li>
            </ul>
          </nav>
        </div>
        <p className="disclaimer">{footer.disclaimer}</p>
      </div>
    </footer>
  );
}
