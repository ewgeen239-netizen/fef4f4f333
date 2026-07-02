import Image from "next/image";
import Link from "next/link";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { selectedWorks } from "@/lib/portfolio";
import Hero from "@/components/home/Hero";
import Reveal from "@/components/animation/Reveal";
import MagneticButton from "@/components/animation/MagneticButton";

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = (isLocale(lang) ? lang : "pl") as Locale;
  const dict = await getDictionary(locale);
  const base = `/${locale}`;

  const blocks = [
    dict.home.forWho,
    dict.home.session,
    dict.home.locationBlock,
  ];

  return (
    <>
      <Hero dict={dict} />

      {/* Selected works */}
      <section className="px-5 py-28 sm:px-8 sm:py-40">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 flex items-end justify-between">
            <Reveal>
              <h2 className="font-serif text-headline">{dict.home.selectedWorks}</h2>
            </Reveal>
            <Reveal delay={0.1}>
              <Link
                href={`${base}/portfolio`}
                className="text-xs uppercase tracking-editorial text-brass transition-opacity hover:opacity-70"
              >
                {dict.home.selectedIndex} →
              </Link>
            </Reveal>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
            {selectedWorks.map((w, i) => (
              <Reveal key={w.id} delay={(i % 3) * 0.08}>
                <Link
                  href={`${base}/portfolio`}
                  className="group relative block aspect-[3/4] overflow-hidden bg-ink-soft"
                >
                  <Image
                    src={w.src}
                    alt={w.alt}
                    fill
                    placeholder="blur"
                    blurDataURL={w.blurDataURL}
                    sizes="(max-width:640px) 50vw, 33vw"
                    className="object-cover transition-transform duration-[1.2s] ease-editorial group-hover:scale-105"
                  />
                  <span className="absolute bottom-4 left-4 text-[11px] uppercase tracking-editorial text-bone opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* For who / session / location */}
      <section className="border-t border-white/5 px-5 py-28 sm:px-8 sm:py-40">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 md:grid-cols-3">
          {blocks.map((b, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="border-t border-brass/30 pt-6">
                <span className="text-[11px] uppercase tracking-editorial text-brass-dim">
                  0{i + 1}
                </span>
                <h3 className="mt-4 font-serif text-3xl">{b.title}</h3>
                <p className="mt-4 text-bone-dim text-pretty">{b.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden px-5 py-32 sm:px-8 sm:py-48">
        <Image
          src="/images/portfolio/portfolio-03.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-top opacity-25"
        />
        <div className="absolute inset-0 bg-ink/70" />
        <div className="relative mx-auto max-w-4xl text-center">
          <Reveal mask>
            <h2 className="font-serif text-headline text-balance">{dict.home.ctaTitle}</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mx-auto mt-6 max-w-md text-bone-dim">{dict.home.ctaBody}</p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="mt-12 flex justify-center">
              <MagneticButton href={`${base}/contact`}>
                {dict.common.bookSession}
              </MagneticButton>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
