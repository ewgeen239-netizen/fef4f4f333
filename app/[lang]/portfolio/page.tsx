import type { Metadata } from "next";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { works } from "@/lib/portfolio";
import ArchiveScroll from "@/components/gallery/ArchiveScroll";

const SCROLL: Record<Locale, string> = {
  en: "Scroll",
  pl: "Przewiń",
  ru: "Листайте",
  ua: "Гортайте",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary((isLocale(lang) ? lang : "pl") as Locale);
  return { title: dict.portfolio.title, description: dict.portfolio.intro };
}

export default async function PortfolioPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = (isLocale(lang) ? lang : "pl") as Locale;
  const dict = await getDictionary(locale);

  return (
    <ArchiveScroll
      works={works}
      heroSrc="/images/portfolio/portfolio-16.webp"
      ctaHref={`/${locale}/contact`}
      labels={{
        kicker: dict.portfolio.kicker,
        title: dict.portfolio.title,
        intro: dict.portfolio.intro,
        scroll: SCROLL[locale],
        cta: dict.common.bookSession,
        lightbox: {
          close: dict.portfolio.close,
          prev: dict.portfolio.prev,
          next: dict.portfolio.next,
        },
      }}
    />
  );
}
