"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { cn } from "@/lib/utils";
import LanguageSwitcher from "./LanguageSwitcher";
import LocalTime from "@/components/ui/LocalTime";

const NAV = [
  { key: "home", href: "" },
  { key: "studio", href: "/studio" },
  { key: "portfolio", href: "/portfolio" },
  { key: "services", href: "/services" },
  { key: "process", href: "/process" },
  { key: "contact", href: "/contact" },
] as const;

const LANG_LABEL: Record<Locale, string> = {
  en: "Language",
  pl: "Język",
  ru: "Язык",
  ua: "Мова",
};

export default function Header({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const base = `/${lang}`;

  // Scrolled state → panel gets more opaque + a hairline border
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on navigation
  useEffect(() => setMobileOpen(false), [pathname]);

  // Escape closes mobile menu
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMobileOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  const isActive = (href: string) =>
    href === "" ? pathname === base : pathname.startsWith(`${base}${href}`);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-500",
        scrolled || mobileOpen
          ? "border-b border-white/10 bg-ink/85 backdrop-blur-md"
          : "border-b border-transparent bg-ink/30 backdrop-blur-sm"
      )}
    >
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-6 px-5 py-4 sm:px-8">
        {/* Wordmark */}
        <Link
          href={base}
          className="shrink-0 font-serif text-lg tracking-tight text-bone transition-opacity hover:opacity-70"
        >
          Krasnovska<span className="text-brass"> PH</span>
        </Link>

        {/* Desktop / tablet horizontal nav */}
        <nav aria-label={dict.nav.menu} className="hidden md:block">
          <ul className="flex items-center gap-7 lg:gap-9">
            {NAV.map((item) => {
              const href = `${base}${item.href}`;
              const active = isActive(item.href);
              return (
                <li key={item.key}>
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "group relative py-1 text-xs uppercase tracking-editorial transition-colors duration-300",
                      active ? "text-brass" : "text-bone-dim hover:text-bone"
                    )}
                  >
                    {dict.nav.items[item.key]}
                    {/* underline: full for active, wipe-in on hover */}
                    <span
                      className={cn(
                        "absolute -bottom-0.5 left-0 h-px bg-brass transition-all duration-300 ease-editorial",
                        active ? "w-full" : "w-0 group-hover:w-full"
                      )}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Right cluster */}
        <div className="flex shrink-0 items-center gap-5">
          <span className="hidden items-center gap-2 text-[11px] uppercase tracking-editorial text-bone-dim lg:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-brass" />
            <LocalTime prefix={dict.common.location} />
          </span>
          <LanguageSwitcher current={lang} className="hidden sm:flex" />

          {/* Mobile hamburger — ONLY below md */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? dict.nav.close : dict.nav.menu}
            className="relative flex h-5 w-6 flex-col justify-center gap-[5px] md:hidden"
          >
            <span
              className={cn(
                "block h-px w-full bg-bone transition-transform duration-300",
                mobileOpen && "translate-y-[3px] rotate-45"
              )}
            />
            <span
              className={cn(
                "block h-px w-full bg-bone transition-transform duration-300",
                mobileOpen && "-translate-y-[3px] -rotate-45"
              )}
            />
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            id="mobile-nav"
            aria-label={dict.nav.menu}
            className="overflow-hidden border-t border-white/10 md:hidden"
            initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            animate={reduce ? { opacity: 1 } : { height: "auto", opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Language — its own drawer section, before the page tabs */}
            <div className="border-b border-white/10 px-5 py-5">
              <span className="mb-3 block text-[10px] uppercase tracking-editorial text-brass-dim">
                {LANG_LABEL[lang]}
              </span>
              <LanguageSwitcher current={lang} className="gap-3 text-sm" />
            </div>

            <ul className="px-5 py-4">
              {NAV.map((item, i) => {
                const href = `${base}${item.href}`;
                const active = isActive(item.href);
                return (
                  <li key={item.key} className="border-b border-white/5 last:border-0">
                    <Link
                      href={href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex items-baseline gap-4 py-4",
                        active ? "text-brass" : "text-bone"
                      )}
                    >
                      <span className="w-6 font-sans text-[10px] text-brass-dim">
                        0{i + 1}
                      </span>
                      <span className="font-serif text-2xl">{dict.nav.items[item.key]}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="px-5 pb-5 pt-2 text-[11px] uppercase tracking-editorial text-bone-dim">
              <LocalTime prefix={dict.common.location} />
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
