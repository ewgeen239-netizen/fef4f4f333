"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect } from "react";
import type { Work } from "@/lib/portfolio";

type Labels = { close: string; prev: string; next: string };

export default function Lightbox({
  works,
  index,
  onClose,
  onNavigate,
  labels,
}: {
  works: Work[];
  index: number | null;
  onClose: () => void;
  onNavigate: (i: number) => void;
  labels: Labels;
}) {
  const open = index !== null;

  const go = useCallback(
    (dir: 1 | -1) => {
      if (index === null) return;
      onNavigate((index + dir + works.length) % works.length);
    },
    [index, works.length, onNavigate]
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    document.documentElement.classList.add("lenis-stopped");
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.classList.remove("lenis-stopped");
    };
  }, [open, go, onClose]);

  const work = index !== null ? works[index] : null;

  return (
    <AnimatePresence>
      {open && work && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-ink/95 p-4 backdrop-blur-sm sm:p-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          onClick={onClose}
        >
          <button
            onClick={onClose}
            aria-label={labels.close}
            className="absolute right-5 top-5 z-10 text-xs uppercase tracking-editorial text-bone hover:text-brass"
          >
            {labels.close} ✕
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); go(-1); }}
            aria-label={labels.prev}
            className="absolute left-3 z-10 p-4 text-2xl text-bone/60 hover:text-brass sm:left-8"
          >
            ←
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); go(1); }}
            aria-label={labels.next}
            className="absolute right-3 z-10 p-4 text-2xl text-bone/60 hover:text-brass sm:right-8"
          >
            →
          </button>

          <motion.div
            key={work.id}
            className="relative max-h-[85vh] w-full max-w-4xl"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={work.src}
              alt={work.alt}
              width={work.width}
              height={work.height}
              placeholder="blur"
              blurDataURL={work.blurDataURL}
              sizes="90vw"
              className="mx-auto max-h-[85vh] w-auto object-contain"
            />
            <div className="mt-4 flex items-baseline justify-between gap-4">
              <div>
                <span className="font-serif text-xl text-bone">{work.title}</span>
                <span className="mt-1 block text-[10px] uppercase tracking-editorial text-brass">{work.meta}</span>
              </div>
              <span className="shrink-0 text-xs tabular-nums tracking-editorial text-bone-dim">
                {String((index ?? 0) + 1).padStart(2, "0")} / {String(works.length).padStart(2, "0")}
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
