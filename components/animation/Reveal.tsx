"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

type Direction = "up" | "down" | "left" | "right" | "none";

const offset = (d: Direction) => {
  switch (d) {
    case "up": return { y: 40 };
    case "down": return { y: -40 };
    case "left": return { x: 40 };
    case "right": return { x: -40 };
    default: return {};
  }
};

/** Scroll-reveal: fade + slide. Set `mask` for an editorial line-wipe. */
export default function Reveal({
  children,
  direction = "up",
  delay = 0,
  className,
  mask = false,
  as = "div",
}: {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  className?: string;
  mask?: boolean;
  as?: "div" | "section" | "span" | "li";
}) {
  const reduce = useReducedMotion();
  const M = motion[as] as typeof motion.div;

  const variants: Variants = {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, ...offset(direction) },
    show: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1], delay },
    },
  };

  if (mask) {
    return (
      <span className="mask-line">
        <M
          className={className}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-10% 0px" }}
          variants={{
            hidden: { y: reduce ? 0 : "110%", opacity: reduce ? 0 : 1 },
            show: {
              y: 0,
              opacity: 1,
              transition: { duration: 1, ease: [0.22, 1, 0.36, 1], delay },
            },
          }}
        >
          {children}
        </M>
      </span>
    );
  }

  return (
    <M
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-10% 0px" }}
      variants={variants}
    >
      {children}
    </M>
  );
}
