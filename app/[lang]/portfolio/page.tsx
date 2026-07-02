import type { Metadata } from "next";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import SectionHeading from "@/components/ui/SectionHeading";
import FilterableGallery from "@/components/gallery/FilterableGallery";

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
  const dict = await getDictionary((isLocale(lang) ? lang : "pl") as Locale);
  const f = dict.portfolio.filters;

  return (
    <div className="px-5 pb-32 pt-36 sm:px-8 sm:pt-48">
      <div className="mx-auto max-w-7xl">
        <SectionHeading kicker={dict.portfolio.kicker} title={dict.portfolio.title} intro={dict.portfolio.intro} />
        <div className="mt-20">
          <FilterableGallery
            filters={{
              all: f.all,
              portrait: f.portrait,
              branding: f.branding,
              loveStory: f.loveStory,
              reportage: f.reportage,
              lifestyle: f.lifestyle,
            }}
            lightboxLabels={{
              close: dict.portfolio.close,
              prev: dict.portfolio.prev,
              next: dict.portfolio.next,
            }}
          />
        </div>
      </div>
    </div>
  );
}
