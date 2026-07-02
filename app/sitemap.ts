import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n/config";
import { getSiteUrl } from "@/lib/site";

const ROUTES = ["", "/studio", "/portfolio", "/services", "/process", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const now = new Date();

  return locales.flatMap((lang) =>
    ROUTES.map((r) => ({
      url: `${base}/${lang}${r}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: r === "" ? 1 : 0.7,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, `${base}/${l}${r}`])),
      },
    }))
  );
}
