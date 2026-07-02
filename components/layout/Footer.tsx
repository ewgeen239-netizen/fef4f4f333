import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import LocalTime from "@/components/ui/LocalTime";

const NAV = [
  { key: "studio", href: "/studio" },
  { key: "portfolio", href: "/portfolio" },
  { key: "services", href: "/services" },
  { key: "process", href: "/process" },
  { key: "contact", href: "/contact" },
] as const;

export default function Footer({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const base = `/${lang}`;
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/5 px-5 pb-10 pt-20 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          {/* Wordmark + tagline */}
          <div className="md:col-span-5">
            <Link href={base} className="font-serif text-5xl tracking-tight sm:text-7xl">
              Krasnovska<span className="text-brass"> PH</span>
            </Link>
            <p className="mt-6 max-w-xs text-sm text-bone-dim">{dict.footer.tagline}</p>
          </div>

          {/* Nav */}
          <nav className="md:col-span-3" aria-label={dict.footer.nav}>
            <h3 className="mb-5 text-[11px] uppercase tracking-editorial text-brass-dim">
              {dict.footer.nav}
            </h3>
            <ul className="space-y-3">
              {NAV.map((n) => (
                <li key={n.key}>
                  <Link
                    href={`${base}${n.href}`}
                    className="text-sm text-bone transition-colors hover:text-brass"
                  >
                    {dict.nav.items[n.key]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Social */}
          <div className="md:col-span-4">
            <h3 className="mb-5 text-[11px] uppercase tracking-editorial text-brass-dim">
              {dict.footer.social}
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-bone transition-colors hover:text-brass">
                  Instagram {dict.contact.details.instagram}
                </a>
              </li>
              <li>
                <a href="https://t.me" target="_blank" rel="noopener noreferrer" className="text-bone transition-colors hover:text-brass">
                  Telegram {dict.contact.details.telegram}
                </a>
              </li>
              <li>
                <a href={`mailto:${dict.contact.details.email}`} className="text-bone transition-colors hover:text-brass">
                  {dict.contact.details.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col justify-between gap-4 border-t border-white/5 pt-6 text-[11px] uppercase tracking-editorial text-bone-dim sm:flex-row">
          <span>© {year} Krasnovska PH — {dict.footer.rights}</span>
          <LocalTime prefix={dict.common.location} />
          <span>{dict.footer.credits} · Krasnovska PH</span>
        </div>
      </div>
    </footer>
  );
}
