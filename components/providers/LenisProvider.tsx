"use client";

import Lenis from "@studio-freight/lenis";
import { useEffect, type ReactNode } from "react";

// Smooth scroll. Uses the core Lenis class + rAF loop (the /react subpath
// isn't exported by this version). Disabled under prefers-reduced-motion.
export default function LenisProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const lenis = new Lenis({
      lerp: 0.1,
      duration: 1.1,
      smoothWheel: true,
    });

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
