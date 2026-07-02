"use client";

import { LazyMotion, domMax } from "framer-motion";
import type { ReactNode } from "react";

// Loads Framer features once for the whole tree so components can use the
// lightweight `m.*` primitives instead of the full `motion.*` bundle → less
// JS shipped/parsed. domMax includes layout animations (portfolio grid).
export default function MotionProvider({ children }: { children: ReactNode }) {
  return <LazyMotion features={domMax}>{children}</LazyMotion>;
}
