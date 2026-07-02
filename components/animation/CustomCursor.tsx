"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

/** Brass ring cursor that grows over [data-cursor="hover"] targets.
 *  Hidden on touch + reduced-motion. */
export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [active, setActive] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;
    setEnabled(true);

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const el = (e.target as HTMLElement)?.closest?.(
        "a,button,[data-cursor='hover']"
      );
      setActive(Boolean(el));
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[80] mix-blend-difference"
      style={{ x: sx, y: sy }}
    >
      <motion.span
        className="block -translate-x-1/2 -translate-y-1/2 rounded-full border border-bone"
        animate={{
          width: active ? 56 : 14,
          height: active ? 56 : 14,
          opacity: active ? 0.9 : 0.7,
        }}
        transition={{ type: "spring", stiffness: 250, damping: 22 }}
      />
    </motion.div>
  );
}
