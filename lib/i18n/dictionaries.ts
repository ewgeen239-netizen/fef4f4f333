import "server-only";
import type { Locale } from "./config";

// Dictionaries loaded server-side, per request. Typed against the PL shape.
const dictionaries = {
  en: () => import("@/messages/en.json").then((m) => m.default),
  pl: () => import("@/messages/pl.json").then((m) => m.default),
  ru: () => import("@/messages/ru.json").then((m) => m.default),
  ua: () => import("@/messages/ua.json").then((m) => m.default),
} as const;

export type Dictionary = Awaited<ReturnType<(typeof dictionaries)["pl"]>>;

export const getDictionary = async (locale: Locale): Promise<Dictionary> =>
  dictionaries[locale]();
