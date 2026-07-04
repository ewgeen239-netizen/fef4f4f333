"use client";

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

export default function Header({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const base = `/${lang}`;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    href === "" ? pathname === base : pathname.startsWith(`${base}${href}`);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-500",
        scrolled
          ? "border-b border-white/10 bg-ink/85 backdrop-blur-md"
          : "border-b border-transparent bg-ink/30 backdrop-blur-sm"
      )}
    >
      <div className="mx-auto max-w-[1600px] px-5 py-3 sm:px-8 sm:py-4">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          {/* Wordmark */}
          <Link
            href={base}
            className="order-1 mr-auto shrink-0 font-serif text-lg tracking-tight text-bone transition-opacity hover:opacity-70 md:mr-0"
          >
            Krasnovska<span className="text-brass"> PH</span>
          </Link>

          {/* Right cluster: local time (lg) + language switcher */}
          <div className="order-2 flex shrink-0 items-center gap-4 md:order-3">
            <span className="hidden items-center gap-2 text-[11px] uppercase tracking-editorial text-bone-dim lg:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-brass" />
              <LocalTime prefix={dict.common.location} />
            </span>
            <LanguageSwitcher current={lang} />
          </div>

          {/* Horizontal tabs — visible on every screen; scrolls on narrow phones */}
          <nav
            aria-label={dict.nav.menu}
            className="no-scrollbar order-3 -mx-5 w-[calc(100%+2.5rem)] overflow-x-auto px-5 md:order-2 md:mx-0 md:w-auto md:flex-1 md:overflow-visible md:px-0"
          >
            <ul className="flex items-center gap-5 whitespace-nowrap md:justify-center lg:gap-8">
              {NAV.map((item) => {
                const href = `${base}${item.href}`;
                const active = isActive(item.href);
                return (
                  <li key={item.key}>
                    <Link
                      href={href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "group relative block py-1 text-[11px] uppercase tracking-editorial transition-colors duration-300",
                        active ? "text-brass" : "text-bone-dim hover:text-bone"
                      )}
                    >
                      {dict.nav.items[item.key]}
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
        </div>
      </div>
    </header>
  );
}
