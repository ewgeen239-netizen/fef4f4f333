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

        {/* Story */}
        <section className="mt-28 grid grid-cols-1 gap-10 border-t border-white/5 pt-16 md:grid-cols-12 md:gap-16">
          <Reveal className="md:col-span-4">
            <h2 className="text-[11px] uppercase tracking-editorial text-brass">
              {dict.studio.storyTitle}
            </h2>
          </Reveal>
          <div className="space-y-6 md:col-span-8">
            {dict.studio.story.map((p, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <p className="text-lg leading-relaxed text-bone-dim text-pretty">{p}</p>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Journey — timeline of development */}
        <section className="mt-28 border-t border-white/5 pt-16">
          <Reveal>
            <h2 className="text-[11px] uppercase tracking-editorial text-brass">
              {dict.studio.journeyTitle}
            </h2>
          </Reveal>
          <ol className="mt-10">
            {dict.studio.journey.map((j, i) => (
              <Reveal as="li" key={j.year} delay={(i % 3) * 0.06}>
                <div className="grid grid-cols-1 gap-2 border-t border-white/5 py-8 first:border-t-0 md:grid-cols-12 md:gap-6">
                  <div className="font-serif text-3xl text-brass md:col-span-3 sm:text-4xl">
                    {j.year}
                  </div>
                  <div className="md:col-span-9">
                    <h3 className="font-serif text-xl sm:text-2xl">{j.title}</h3>
                    <p className="mt-2 max-w-2xl text-bone-dim text-pretty">{j.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </section>

        {/* Specialties */}
        <section className="mt-28 border-t border-white/5 pt-16">
          <Reveal>
            <h2 className="text-[11px] uppercase tracking-editorial text-brass">
              {dict.studio.specialtiesTitle}
            </h2>
          </Reveal>
          <div className="mt-10 grid grid-cols-1 gap-px overflow-hidden border border-white/5 bg-white/5 sm:grid-cols-2">
            {dict.studio.specialties.map((s, i) => (
              <Reveal key={s.name} delay={(i % 2) * 0.08}>
                <div className="flex h-full flex-col bg-ink p-8 transition-colors duration-500 hover:bg-ink-soft sm:p-10">
                  <h3 className="font-serif text-2xl sm:text-3xl">{s.name}</h3>
                  <p className="mt-3 text-bone-dim text-pretty">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

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
