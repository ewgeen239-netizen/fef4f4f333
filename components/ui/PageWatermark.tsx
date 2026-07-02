"use client";

import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n/config";

type NavItems = Record<"home" | "studio" | "portfolio" | "services" | "process" | "contact", string>;

const SEGMENTS: Array<{ match: string; key: keyof NavItems }> = [
  { match: "/studio", key: "studio" },
  { match: "/portfolio", key: "portfolio" },
  { match: "/services", key: "services" },
  { match: "/process", key: "process" },
  { match: "/contact", key: "contact" },
];

/** Barely-visible giant page name behind the content — sits at -z-10 over the
 *  base background. Purely decorative. */
export default function PageWatermark({
  lang,
  navItems,
}: {
  lang: Locale;
  navItems: NavItems;
}) {
  const pathname = usePathname();
  const rest = pathname.replace(new RegExp(`^/${lang}`), "") || "/";
  const seg = SEGMENTS.find((s) => rest.startsWith(s.match));
  const label = seg ? navItems[seg.key] : navItems.home;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 flex items-center justify-center overflow-hidden"
    >
      <span className="select-none whitespace-nowrap font-serif uppercase leading-none tracking-tight text-bone/[0.028] text-[26vw] md:text-[20vw]">
        {label}
      </span>
    </div>
  );
}
