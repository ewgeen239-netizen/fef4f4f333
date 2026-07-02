"use client";

import { LazyMotion, domAnimation } from "framer-motion";
import type { ReactNode } from "react";

// Loads Framer features once for the whole tree so components use the light
// `m.*` primitives instead of the full `motion.*` bundle. domAnimation is the
// smaller feature set (no layout/drag) — enough for all our animations now
// that the portfolio grid uses CSS instead of layout animations.
export default function MotionProvider({ children }: { children: ReactNode }) {
  return <LazyMotion features={domAnimation}>{children}</LazyMotion>;
}
