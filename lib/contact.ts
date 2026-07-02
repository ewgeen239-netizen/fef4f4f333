// Single source for contact links. Components show the handle/label only —
// full URLs stay hidden for a clean, harmonious look.
export const CONTACT = {
  email: { label: "hello@krasnovska.ph", href: "mailto:hello@krasnovska.ph" },
  phone: { label: "+48 739 604 196", href: "tel:+48739604196" },
  instagram: {
    label: "@krasnovska_ph",
    href: "https://www.instagram.com/krasnovska_ph/?hl=ru",
  },
  telegram: { label: "@ka_rina9746", href: "https://t.me/ka_rina9746" },
} as const;
