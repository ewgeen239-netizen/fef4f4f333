import type { Metadata } from "next";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/animation/Reveal";
import ReservationForm from "@/components/booking/ReservationForm";
import CalcomEmbed from "@/components/booking/CalcomEmbed";

const MONTHS: Record<Locale, string[]> = {
  en: ["January","February","March","April","May","June","July","August","September","October","November","December"],
  pl: ["Styczeń","Luty","Marzec","Kwiecień","Maj","Czerwiec","Lipiec","Sierpień","Wrzesień","Październik","Listopad","Grudzień"],
  ru: ["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"],
  ua: ["Січень","Лютий","Березень","Квітень","Травень","Червень","Липень","Серпень","Вересень","Жовтень","Листопад","Грудень"],
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary((isLocale(lang) ? lang : "pl") as Locale);
  return { title: dict.contact.title, description: dict.contact.intro };
}

export default async function ContactPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ type?: string }>;
}) {
  const { lang } = await params;
  const { type } = await searchParams;
  const locale = (isLocale(lang) ? lang : "pl") as Locale;
  const dict = await getDictionary(locale);

  const provider = process.env.BOOKING_PROVIDER ?? "self";
  const calLink = process.env.NEXT_PUBLIC_CALCOM_LINK ?? "";
  const d = dict.contact.details;

  return (
    <div className="px-5 pb-32 pt-36 sm:px-8 sm:pt-48">
      <div className="mx-auto max-w-7xl">
        <SectionHeading kicker={dict.contact.kicker} title={dict.contact.title} intro={dict.contact.intro} />

        <div className="mt-20">
          {provider === "calcom" && calLink ? (
            <CalcomEmbed calLink={calLink} />
          ) : (
            <ReservationForm
              dict={dict.contact}
              loadingLabel={dict.common.sending}
              monthNames={MONTHS[locale]}
              initialType={type}
            />
          )}
        </div>

        {/* Contact details + location */}
        <div className="mt-32 grid grid-cols-1 gap-12 border-t border-white/5 pt-16 md:grid-cols-12">
          <div className="md:col-span-4">
            <Reveal>
              <h2 className="text-[11px] uppercase tracking-editorial text-brass">{d.title}</h2>
              <ul className="mt-6 space-y-2 text-lg">
                <li><a href={`mailto:${d.email}`} className="hover:text-brass">{d.email}</a></li>
                <li><a href={`tel:${d.phone.replace(/\s/g, "")}`} className="hover:text-brass">{d.phone}</a></li>
                <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-brass">Instagram {d.instagram}</a></li>
                <li><a href="https://t.me" target="_blank" rel="noopener noreferrer" className="hover:text-brass">Telegram {d.telegram}</a></li>
              </ul>
              <p className="mt-8 text-bone-dim">{d.address}</p>
            </Reveal>
          </div>

          {/* Map */}
          <div className="md:col-span-8">
            <Reveal direction="left">
              <div className="relative aspect-[16/9] overflow-hidden border border-white/5 grayscale">
                <iframe
                  title="Krasnovska PH — Szczecin"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=14.52%2C53.42%2C14.58%2C53.45&layer=mapnik&marker=53.435,14.552"
                  className="h-full w-full opacity-80"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
}
