"use client";

import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useRef, type ReactNode, type MouseEvent } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  strength?: number;
  ariaLabel?: string;
};

/** Button/link that leans toward the cursor. Degrades to a static element
 *  under prefers-reduced-motion. */
export default function MagneticButton({
  children,
  href,
  onClick,
  className,
  strength = 0.35,
  ariaLabel,
}: Props) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const sy = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  function handleMove(e: MouseEvent) {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  }
  function reset() {
    x.set(0);
    y.set(0);
  }

  const base = cn(
    "group relative inline-flex items-center justify-center gap-3 rounded-full border border-brass/40 px-8 py-4 text-xs uppercase tracking-editorial text-bone transition-colors duration-500 hover:bg-brass hover:text-ink",
    className
  );

  const inner = (
    <motion.span style={{ x: sx, y: sy }} className={base}>
      {children}
    </motion.span>
  );

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      className="inline-block"
      data-cursor="hover"
    >
      {href ? (
        <Link href={href} aria-label={ariaLabel} onClick={onClick}>
          {inner}
        </Link>
      ) : (
        <button type="button" aria-label={ariaLabel} onClick={onClick}>
          {inner}
        </button>
      )}
    </motion.div>
  );
}
