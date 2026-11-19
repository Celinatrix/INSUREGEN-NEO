"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { Dict, Locale } from "@/i18n";
import { BrandMark } from "./BrandMark";

function rememberLang(l: Locale) {
  document.cookie = `fr-lang=${l};path=/;max-age=31536000;samesite=lax`;
}

export function Header({ lang, nav }: { lang: Locale; nav: Dict["nav"] }) {
  const pathname = usePathname() ?? `/${lang}`;
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const home = `/${lang}`;
  const links = [
    { href: `${home}#van-de`, label: nav.problem },
    { href: `${home}#vi-cham-soc`, label: nav.wallet },
    { href: `${home}#boi-thuong`, label: nav.claims },
    // Trên desktop nút vàng "Tính phí" đã làm việc này; link chỉ hiện trong menu di động.
    { href: `${home}/tinh-phi`, label: nav.pricing, menuOnly: true },
    { href: `${home}/cis`, label: nav.cis },
    { href: `${home}/vi-cham-soc`, label: nav.demo },
    { href: `${home}/co-so-dinh-phi`, label: nav.basis },
  ];
  const switchHref = (l: Locale) => pathname.replace(/^\/(vi|en)(?=\/|$)/, `/${l}`);

  return (
    <header className="site-header">
      <nav className="wrap nav" aria-label={nav.protection}>
        <Link className="brand" href={home} onClick={() => setOpen(false)}>
          <BrandMark size={32} />
          <span>Family Reconnect</span>
        </Link>
        <ul className={`nav-links${open ? " open" : ""}`} id="navLinks">
          {links.map((l) => (
            <li key={l.href} className={l.menuOnly ? "menu-only" : undefined}>
              <Link
                href={l.href}
                onClick={() => setOpen(false)}
                aria-current={!l.href.includes("#") && pathname === l.href ? "page" : undefined}
              >
                {l.label}
              </Link>
            </li>
          ))}
          <li className="mobile-only">
            <Link href={switchHref(lang === "vi" ? "en" : "vi")} onClick={() => rememberLang(lang === "vi" ? "en" : "vi")}>
              {lang === "vi" ? "English" : "Tiếng Việt"}
            </Link>
          </li>
        </ul>
        <div className="nav-tools">
          <div className="lang-switch" role="group" aria-label={nav.language}>
            {(["vi", "en"] as const).map((l) => (
              <Link
                key={l}
                href={switchHref(l)}
                hrefLang={l}
                lang={l}
                aria-current={l === lang ? "true" : undefined}
                onClick={() => rememberLang(l)}
              >
                {l.toUpperCase()}
              </Link>
            ))}
          </div>
          <button
            type="button"
            className="icon-btn menu-btn"
            aria-expanded={open}
            aria-controls="navLinks"
            aria-label={nav.menu}
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
          <Link className="btn btn-primary btn-sm nav-cta" href={`${home}/tinh-phi`}>
            {nav.cta}
          </Link>
        </div>
      </nav>
    </header>
  );
}
