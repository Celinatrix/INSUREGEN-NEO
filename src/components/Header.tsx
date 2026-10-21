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
    { href: `${home}#bao-ve`, label: nav.protection },
    { href: `${home}#vi-cham-soc`, label: nav.wallet },
    { href: `${home}#boi-thuong`, label: nav.claims },
    { href: `${home}/tinh-phi`, label: nav.pricing },
    { href: `${home}/cis`, label: nav.cis },
    { href: `${home}/vi-cham-soc`, label: nav.demo },
  ];
  const switchHref = (l: Locale) => pathname.replace(/^\/(vi|en)(?=\/|$)/, `/${l}`);

  function toggleTheme() {
    const root = document.documentElement;
    const cur = root.dataset.theme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const next = cur === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try {
      localStorage.setItem("fr-theme", next);
    } catch {}
  }

  return (
    <header className="site-header">
      <nav className="wrap nav" aria-label={nav.protection}>
        <Link className="brand" href={home} onClick={() => setOpen(false)}>
          <BrandMark size={32} />
          <span>Family Reconnect</span>
        </Link>
        <ul className={`nav-links${open ? " open" : ""}`} id="navLinks">
          {links.map((l) => (
            <li key={l.href}>
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
          <button type="button" className="icon-btn" onClick={toggleTheme} aria-label={nav.theme}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
            </svg>
          </button>
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
