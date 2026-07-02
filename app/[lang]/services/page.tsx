import type { Metadata } from "next";
import Link from "next/link";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { packages } from "@/lib/packages";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/animation/Reveal";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary((isLocale(lang) ? lang : "pl") as Locale);
  return { title: dict.services.title, description: dict.services.intro };
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = (isLocale(lang) ? lang : "pl") as Locale;
  const dict = await getDictionary(locale);
  const s = dict.services;

  return (
    <div className="px-5 pb-32 pt-36 sm:px-8 sm:pt-48">
      <div className="mx-auto max-w-7xl">
        <SectionHeading kicker={s.kicker} title={s.title} intro={s.intro} />

        {/* Two package cards, driven by the typed packages[] array */}
        <div className="mt-24 grid grid-cols-1 gap-px overflow-hidden border border-white/5 bg-white/5 md:grid-cols-2">
          {packages.map((pkg, i) => {
            const p = s.packages[pkg.id];
            return (
              <Reveal key={pkg.id} delay={(i % 2) * 0.1} as="section">
                <article className="flex h-full flex-col bg-ink p-8 transition-colors duration-500 hover:bg-ink-soft sm:p-12">
                  <header>
                    <h2 className="font-serif text-3xl sm:text-4xl">{p.name}</h2>
                    <p className="mt-4 text-bone-dim text-pretty">{p.description}</p>
                  </header>

                  {/* Price — large */}
                  <p className="mt-10 flex items-baseline gap-2">
                    <span className="font-serif text-5xl text-brass sm:text-6xl">{pkg.price}</span>
                    <span className="text-sm text-bone-dim">{s.perHour}</span>
                  </p>

                  <h3 className="mt-10 text-[11px] uppercase tracking-editorial text-brass-dim">
                    {s.includes}
                  </h3>
                  <ul className="mt-6 space-y-3 border-t border-white/5 pt-6">
                    {p.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-3 text-sm text-bone text-pretty">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brass" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <p className="mt-6 text-xs text-bone-dim/70">{s.studioNote}</p>

                  <div className="mt-auto pt-10">
                    <Link
                      href={`/${locale}/contact?type=${pkg.sessionType}`}
                      className="group inline-flex items-center gap-3 rounded-full border border-brass/40 px-7 py-3 text-xs uppercase tracking-editorial text-bone transition-colors duration-500 hover:bg-brass hover:text-ink"
                    >
                      {s.book}
                      <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </Link>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </div>
  );
}
