import type { Metadata } from "next";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/animation/Reveal";
import Faq from "@/components/ui/Faq";
import MagneticButton from "@/components/animation/MagneticButton";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary((isLocale(lang) ? lang : "pl") as Locale);
  return { title: dict.process.title, description: dict.process.intro };
}

export default async function ProcessPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = (isLocale(lang) ? lang : "pl") as Locale;
  const dict = await getDictionary(locale);

  return (
    <div className="px-5 pb-32 pt-36 sm:px-8 sm:pt-48">
      <div className="mx-auto max-w-7xl">
        <SectionHeading kicker={dict.process.kicker} title={dict.process.title} intro={dict.process.intro} />

        {/* Timeline */}
        <ol className="mt-24">
          {dict.process.steps.map((s, i) => (
            <Reveal as="li" key={s.n} delay={(i % 2) * 0.05}>
              <div className="group grid grid-cols-1 items-start gap-4 border-t border-white/5 py-10 transition-colors duration-500 hover:bg-ink-soft/40 md:grid-cols-12 md:gap-8">
                <div className="font-serif text-6xl text-brass/40 transition-colors duration-500 group-hover:text-brass md:col-span-2">
                  {s.n}
                </div>
                <h2 className="font-serif text-3xl md:col-span-4 sm:text-4xl">{s.title}</h2>
                <p className="max-w-md text-bone-dim text-pretty md:col-span-6">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </ol>

        {/* FAQ */}
        <div className="mt-32 grid grid-cols-1 gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <Reveal>
              <h2 className="font-serif text-headline">{dict.process.faqTitle}</h2>
            </Reveal>
          </div>
          <div className="md:col-span-8">
            <Faq items={dict.process.faq} />
          </div>
        </div>

        <div className="mt-28 flex justify-center">
          <MagneticButton href={`/${locale}/contact`}>{dict.common.bookSession}</MagneticButton>
        </div>
      </div>
    </div>
  );
}
