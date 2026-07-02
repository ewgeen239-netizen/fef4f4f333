"use client";

import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** Wraps page content; keyed by pathname for enter animation on route change.
 *  Used from template.tsx so it remounts per navigation. */
export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduce = useReducedMotion();

  return (
    <>
      {/* Brass wipe that sweeps up on entry */}
      {!reduce && (
        <motion.div
          key={`${pathname}-wipe`}
          className="pointer-events-none fixed inset-0 z-[70] origin-bottom bg-ink"
          initial={{ scaleY: 1 }}
          animate={{ scaleY: 0 }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
        />
      )}
      <motion.div
        key={pathname}
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: reduce ? 0 : 0.25 }}
      >
        {children}
      </motion.div>
    </>
  );
}
