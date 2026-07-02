"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import LocalTime from "@/components/ui/LocalTime";

export default function Hero({ dict }: { dict: Dictionary }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "22%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.12]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "-40%"]);

  const words = dict.home.tagline.split(" ");

  return (
    <section ref={ref} className="relative h-[100svh] w-full overflow-hidden">
      {/* Parallax image */}
      <motion.div style={{ y, scale }} className="absolute inset-0">
        <Image
          src="/images/hero.webp"
          alt={dict.meta.ogAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/20 to-ink" />
      </motion.div>

      {/* Headline */}
      <motion.div
        style={{ y: textY }}
        className="relative z-10 flex h-full flex-col justify-end px-5 pb-24 sm:px-8"
      >
        <h1 className="max-w-4xl font-serif text-headline text-balance">
          {words.map((w, i) => (
            <span key={i} className="mask-line mr-[0.22em] inline-block">
              <motion.span
                className={`inline-block ${i === words.length - 1 ? "italic text-brass" : ""}`}
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ delay: 0.35 + i * 0.09, duration: 1, ease: [0.22, 1, 0.36, 1] }}
              >
                {w}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.9 }}
          className="mt-7 max-w-xl text-sm leading-relaxed text-bone-dim text-pretty sm:text-base"
        >
          {dict.home.heroSub}
        </motion.p>
      </motion.div>

      {/* Bottom meta row */}
      <div className="absolute inset-x-0 bottom-6 z-10 flex items-center justify-between px-5 text-[11px] uppercase tracking-editorial text-bone-dim sm:px-8">
        <LocalTime prefix={dict.common.location} />
        <span className="hidden sm:inline">{dict.common.availability}</span>
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          aria-hidden
        >
          ↓
        </motion.span>
      </div>
    </section>
  );
}
