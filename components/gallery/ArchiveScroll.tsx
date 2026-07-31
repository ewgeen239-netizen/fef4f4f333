"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Work } from "@/lib/portfolio";
import Lightbox from "./Lightbox";

type Labels = {
  kicker: string;
  title: string;
  intro: string;
  scroll: string;
  cta: string;
  lightbox: { close: string; prev: string; next: string };
};

/** Scattered gallery layout: rows with 1–2 images and gaps (-1 = empty). */
function buildLayout(count: number, cols: number): number[][] {
  const rows: number[][] = [];
  let placed = 0;
  let r = 0;
  while (placed < count) {
    const row = new Array(cols).fill(-1);
    const a = (r * 2 + (r % 2)) % cols;
    row[a] = placed++;
    if (placed < count && r % 3 === 0) {
      let b = (a + 2) % cols;
      if (b === a) b = (a + 1) % cols;
      if (row[b] === -1) row[b] = placed++;
    }
    rows.push(row);
    r++;
  }
  return rows;
}

export default function ArchiveScroll({
  works,
  heroSrc,
  ctaHref,
  labels,
}: {
  works: Work[];
  heroSrc: string;
  ctaHref: string;
  labels: Labels;
}) {
  const spacerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const [cols, setCols] = useState(4);
  const [reduced, setReduced] = useState(false);
  const [ready, setReady] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);

  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth;
      setCols(w < 640 ? 2 : w < 1024 ? 3 : 4);
      setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
      setReady(true);
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  const layout = useMemo(() => buildLayout(works.length, cols), [works.length, cols]);

  // RAF-driven scroll engine (skipped under reduced-motion → static grid below).
  useEffect(() => {
    if (reduced || !ready) return;

    let raf = 0;
    let vh = window.innerHeight;
    let maxScroll = 0;
    let cards: HTMLElement[] = [];

    const measure = () => {
      vh = window.innerHeight;
      const inner = innerRef.current;
      cards = inner ? Array.from(inner.querySelectorAll<HTMLElement>(".bp-card")) : [];
      if (inner) maxScroll = Math.max(0, inner.scrollHeight - vh);
      if (spacerRef.current) spacerRef.current.style.height = `${vh + maxScroll + 2 * vh}px`;
    };

    const frame = () => {
      const y = window.scrollY;

      // Phase 1 — black panel slides up over the hero (0 → vh).
      const panelY = Math.max(0, vh - y);
      if (panelRef.current) panelRef.current.style.transform = `translateY(${panelY}px)`;

      // Hero fades out near the end of phase 1.
      if (heroRef.current) {
        const o = y < vh * 0.85 ? 1 : Math.max(0, 1 - (y - vh * 0.85) / (vh * 0.15));
        heroRef.current.style.opacity = `${o}`;
        heroRef.current.style.visibility = y > vh ? "hidden" : "visible";
      }

      // Phase 2 — grid scrolls up inside the fixed panel.
      const innerY = y > vh ? Math.min(maxScroll, y - vh) : 0;
      if (innerRef.current) innerRef.current.style.transform = `translateY(${-innerY}px)`;

      // Per-card scale by viewport position.
      for (const el of cards) {
        const r = el.getBoundingClientRect();
        let s = 0;
        if (!(r.bottom <= 0 || r.top >= vh)) {
          const enter = Math.min(1, (vh - r.top) / (vh * 0.6));
          const exit = Math.min(1, r.bottom / (vh * 0.4));
          s = Math.max(0, Math.min(enter, exit));
        }
        el.style.transform = `scale(${s.toFixed(3)})`;
      }

      // Outro — overlay + CTA reveal after the grid is done.
      const outro = Math.max(0, Math.min(1, (y - vh - maxScroll) / (vh * 0.8)));
      if (overlayRef.current) overlayRef.current.style.opacity = `${outro}`;
      if (ctaRef.current) {
        ctaRef.current.style.transform = `scale(${outro.toFixed(3)})`;
        ctaRef.current.style.pointerEvents = outro > 0.6 ? "auto" : "none";
      }

      raf = requestAnimationFrame(frame);
    };

    measure();
    // Re-measure after images affect layout height.
    const t = setTimeout(measure, 300);
    window.addEventListener("resize", measure);
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
      window.removeEventListener("resize", measure);
      if (spacerRef.current) spacerRef.current.style.height = "";
    };
  }, [reduced, ready, layout]);

  // ── Reduced-motion / SSR-safe fallback: plain responsive grid ──────────
  if (reduced) {
    return (
      <div className="px-5 pb-32 pt-36 sm:px-8 sm:pt-48">
        <div className="mx-auto max-w-7xl">
          <span className="text-[11px] uppercase tracking-editorial text-brass">{labels.kicker}</span>
          <h1 className="mt-6 font-serif text-headline">{labels.title}</h1>
          <p className="mt-6 max-w-xl text-bone-dim">{labels.intro}</p>
          <div className="mt-14 columns-2 gap-4 lg:columns-3">
            {works.map((w, i) => (
              <button
                key={w.id}
                onClick={() => setLightbox(i)}
                className="mb-4 block w-full overflow-hidden bg-ink-soft"
              >
                <Image
                  src={w.src}
                  alt={w.alt}
                  width={w.width}
                  height={w.height}
                  placeholder="blur"
                  blurDataURL={w.blurDataURL}
                  sizes="(max-width:640px) 50vw, 33vw"
                  className="w-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
        <Lightbox
          works={works}
          index={lightbox}
          onClose={() => setLightbox(null)}
          onNavigate={setLightbox}
          labels={labels.lightbox}
        />
      </div>
    );
  }

  return (
    <>
      {/* Tall spacer drives scroll length (height set by the engine). */}
      <div ref={spacerRef} className="relative select-none" style={{ height: "500vh" }} />

      {/* Hero — full-screen photo + editorial overlay (z below panel) */}
      <div ref={heroRef} className="pointer-events-none fixed inset-0 z-0">
        <Image src={heroSrc} alt={labels.title} fill priority sizes="100vw" className="object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/50 via-ink/25 to-ink" />
        <div className="absolute inset-0 flex flex-col justify-end px-5 pb-24 sm:px-8">
          <span className="text-[11px] uppercase tracking-editorial text-brass">{labels.kicker}</span>
          <h1 className="mt-4 font-serif text-display text-balance">{labels.title}</h1>
          <p className="mt-6 max-w-md text-sm text-bone-dim text-pretty sm:text-base">{labels.intro}</p>
        </div>
        <div className="absolute inset-x-0 bottom-6 flex justify-center text-[11px] uppercase tracking-editorial text-bone-dim">
          {labels.scroll} ↓
        </div>
      </div>

      {/* Black panel — gallery (slides up over hero) */}
      <div
        ref={panelRef}
        className="fixed inset-0 z-10 overflow-hidden bg-black"
        style={{ transform: "translateY(100vh)" }}
      >
        <div ref={innerRef} style={{ paddingTop: "min(400px, 40vh)", paddingBottom: "40vh" }}>
          {layout.map((row, ri) => (
            <div
              key={ri}
              className="grid gap-3 px-3 sm:gap-4 sm:px-4"
              style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}
            >
              {row.map((cell, ci) => {
                if (cell < 0) return <div key={ci} className="aspect-[2/3]" />;
                const w = works[cell];
                const leftHalf = ci < cols / 2;
                return (
                  <button
                    key={ci}
                    onClick={() => setLightbox(cell)}
                    aria-label={w.alt}
                    className="bp-card group relative block aspect-[2/3] overflow-hidden bg-neutral-900"
                    style={{
                      transform: "scale(0)",
                      transformOrigin: leftHalf ? "right bottom" : "left bottom",
                    }}
                  >
                    <Image
                      src={w.src}
                      alt={w.alt}
                      fill
                      loading="lazy"
                      placeholder="blur"
                      blurDataURL={w.blurDataURL}
                      sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
                      className="object-cover transition-transform duration-700 ease-editorial group-hover:scale-105"
                    />
                    <span className="pointer-events-none absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                      <span className="block font-serif text-sm leading-tight text-bone">{w.title}</span>
                      <span className="mt-0.5 block text-[9px] uppercase tracking-editorial text-brass">{w.meta}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Outro — overlay + CTA */}
      <div
        ref={overlayRef}
        className="pointer-events-none fixed inset-0 z-20 flex flex-col items-center justify-center bg-ink px-6 text-center"
        style={{ opacity: 0 }}
      >
        <span className="text-[11px] uppercase tracking-editorial text-brass">{labels.kicker}</span>
        <p className="mt-6 max-w-lg font-serif text-headline text-balance">{labels.title}</p>
        <div ref={ctaRef} className="mt-12" style={{ transform: "scale(0)", transformOrigin: "center" }}>
          <Link
            href={ctaHref}
            className="inline-flex items-center gap-3 rounded-full border border-brass/50 bg-brass px-10 py-5 text-xs uppercase tracking-editorial text-ink transition-opacity hover:opacity-90"
          >
            {labels.cta} →
          </Link>
        </div>
      </div>

      <Lightbox
        works={works}
        index={lightbox}
        onClose={() => setLightbox(null)}
        onNavigate={setLightbox}
        labels={labels.lightbox}
      />
    </>
  );
}
