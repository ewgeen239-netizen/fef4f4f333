import type { Metadata } from "next";
import Image from "next/image";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/animation/Reveal";
import MagneticButton from "@/components/animation/MagneticButton";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary((isLocale(lang) ? lang : "pl") as Locale);
  return { title: dict.studio.title, description: dict.studio.intro };
}

export default async function StudioPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = (isLocale(lang) ? lang : "pl") as Locale;
  const dict = await getDictionary(locale);

  return (
    <article className="px-5 pb-32 pt-36 sm:px-8 sm:pt-48">
      <div className="mx-auto max-w-7xl">
        <SectionHeading kicker={dict.studio.kicker} title={dict.studio.title} intro={dict.studio.intro} />

        <div className="mt-24 grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">
          {/* Portrait */}
          <Reveal className="md:col-span-5" direction="right">
            <div className="relative aspect-[4/5] overflow-hidden bg-ink-soft">
              <Image
                src="/images/hero.webp"
                alt="Krasnovska PH — portret"
                fill
                sizes="(max-width:768px) 100vw, 40vw"
                placeholder="blur"
                blurDataURL="data:image/webp;base64,UklGRlYAAABXRUJQVlA4IEoAAAAQAgCdASoQAAkAA4BaJQBOgCHw7s3ldGH4AP5A2s9o0+BYydErWdOTX4VSeNHqLOFubuyG7qhb168OyHC6TkBtfjfCRdsqLGoAAA=="
                className="object-cover object-[22%_center]"
              />
            </div>
          </Reveal>

          {/* Text */}
          <div className="md:col-span-7 md:pt-10">
            <Reveal>
              <h2 className="text-[11px] uppercase tracking-editorial text-brass">
                {dict.studio.approachTitle}
              </h2>
              <p className="mt-4 font-serif text-2xl leading-relaxed text-balance sm:text-3xl">
                {dict.studio.approach}
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="mt-16 text-[11px] uppercase tracking-editorial text-brass">
                {dict.studio.philosophyTitle}
              </h2>
              <p className="mt-4 text-lg text-bone-dim text-pretty">{dict.studio.philosophy}</p>
            </Reveal>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-28 grid grid-cols-2 gap-8 border-t border-white/5 pt-12 md:grid-cols-4">
          {dict.studio.stats.map((s, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div>
                <div className="font-serif text-5xl text-brass sm:text-6xl">{s.value}</div>
                <div className="mt-2 text-xs uppercase tracking-editorial text-bone-dim">
                  {s.label}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-28 flex justify-center">
          <MagneticButton href={`/${locale}/contact`}>{dict.common.bookSession}</MagneticButton>
        </div>
      </div>
    </article>
  );
}
