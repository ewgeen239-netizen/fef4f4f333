import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { locales, isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getSiteUrl } from "@/lib/site";
import LenisProvider from "@/components/providers/LenisProvider";
import ScrollTop from "@/components/providers/ScrollTop";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CustomCursor from "@/components/animation/CustomCursor";
import PageWatermark from "@/components/ui/PageWatermark";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = await getDictionary(lang);
  const url = getSiteUrl();

  return {
    title: { default: dict.meta.title, template: "%s — Krasnovska PH" },
    description: dict.meta.description,
    alternates: {
      canonical: `${url}/${lang}`,
      languages: Object.fromEntries(locales.map((l) => [l, `${url}/${l}`])),
    },
    openGraph: {
      type: "website",
      locale: lang,
      title: dict.meta.title,
      description: dict.meta.description,
      url: `${url}/${lang}`,
      siteName: "Krasnovska PH",
      images: [{ url: "/images/og.jpg", width: 1200, height: 630, alt: dict.meta.ogAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.title,
      description: dict.meta.description,
      images: ["/images/og.jpg"],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang as Locale);

  return (
    <LenisProvider>
      <ScrollTop />
      <PageWatermark lang={lang as Locale} navItems={dict.nav.items} />
      <CustomCursor />
      <Header lang={lang} dict={dict} />
      <main id="main">{children}</main>
      <Footer lang={lang} dict={dict} />
    </LenisProvider>
  );
}
