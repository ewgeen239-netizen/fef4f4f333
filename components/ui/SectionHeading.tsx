import Reveal from "@/components/animation/Reveal";

/** Kicker + large serif title used on every inner page header. */
export default function SectionHeading({
  kicker,
  title,
  intro,
}: {
  kicker: string;
  title: string;
  intro?: string;
}) {
  return (
    <div className="max-w-4xl">
      <Reveal>
        <span className="text-[11px] uppercase tracking-editorial text-brass">{kicker}</span>
      </Reveal>
      <Reveal mask delay={0.05}>
        <h1 className="mt-6 font-serif text-headline text-balance">{title}</h1>
      </Reveal>
      {intro && (
        <Reveal delay={0.15}>
          <p className="mt-8 max-w-xl text-lg text-bone-dim text-pretty">{intro}</p>
        </Reveal>
      )}
    </div>
  );
}
