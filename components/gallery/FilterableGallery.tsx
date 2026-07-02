"use client";

import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import Image from "next/image";
import { useMemo, useState } from "react";
import { works, type Category, type Work } from "@/lib/portfolio";
import { cn } from "@/lib/utils";
import Lightbox from "./Lightbox";

type FilterKey = "all" | Category;

const ORDER: FilterKey[] = ["all", "portrait", "branding", "loveStory", "reportage", "lifestyle"];

export default function FilterableGallery({
  filters,
  lightboxLabels,
}: {
  filters: Record<FilterKey, string>;
  lightboxLabels: { close: string; prev: string; next: string };
}) {
  const [active, setActive] = useState<FilterKey>("all");
  const [open, setOpen] = useState<number | null>(null);

  const visible: Work[] = useMemo(
    () => (active === "all" ? works : works.filter((w) => w.category === active)),
    [active]
  );

  return (
    <div>
      {/* Filter bar */}
      <div className="sticky top-16 z-20 -mx-5 mb-12 flex flex-wrap gap-x-6 gap-y-2 bg-ink/80 px-5 py-4 backdrop-blur-md sm:mx-0 sm:rounded-full sm:px-6">
        {ORDER.map((key) => (
          <button
            key={key}
            onClick={() => setActive(key)}
            aria-pressed={active === key}
            className={cn(
              "relative text-xs uppercase tracking-editorial transition-colors duration-300",
              active === key ? "text-brass" : "text-bone-dim hover:text-bone"
            )}
          >
            {filters[key]}
            {active === key && (
              <motion.span
                layoutId="filter-underline"
                className="absolute -bottom-1 left-0 h-px w-full bg-brass"
              />
            )}
          </button>
        ))}
      </div>

      {/* Masonry-ish columns */}
      <LayoutGroup>
        <motion.div layout className="columns-2 gap-3 sm:gap-6 lg:columns-3">
          <AnimatePresence mode="popLayout">
            {visible.map((w, i) => (
              <motion.button
                key={w.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: (i % 6) * 0.04 }}
                onClick={() => setOpen(works.indexOf(w))}
                className="group relative mb-3 block w-full overflow-hidden bg-ink-soft sm:mb-6"
                data-cursor="hover"
                aria-label={w.alt}
              >
                <Image
                  src={w.src}
                  alt={w.alt}
                  width={w.width}
                  height={w.height}
                  placeholder="blur"
                  blurDataURL={w.blurDataURL}
                  loading="lazy"
                  sizes="(max-width:640px) 50vw, 33vw"
                  className="w-full object-cover transition-transform duration-[1.2s] ease-editorial group-hover:scale-[1.06]"
                />
                {/* Name caption — fades up on hover */}
                <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/0 to-ink/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <span className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 p-4 text-left opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  <span className="block font-serif text-lg leading-tight text-bone">{w.title}</span>
                  <span className="mt-1 block text-[10px] uppercase tracking-editorial text-brass">{w.meta}</span>
                </span>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>
      </LayoutGroup>

      {/* Lightbox operates on the full works list for prev/next continuity */}
      <Lightbox
        works={works}
        index={open}
        onClose={() => setOpen(null)}
        onNavigate={setOpen}
        labels={lightboxLabels}
      />
    </div>
  );
}
