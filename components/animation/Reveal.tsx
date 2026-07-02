"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Direction = "up" | "down" | "left" | "right" | "none";
type Tag = "div" | "section" | "span" | "li";

const transformFor = (d: Direction) => {
  switch (d) {
    case "up": return "translateY(40px)";
    case "down": return "translateY(-40px)";
    case "left": return "translateX(40px)";
    case "right": return "translateX(-40px)";
    default: return "none";
  }
};

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

/** Scroll-reveal (fade / slide / mask) with zero animation-library cost —
 *  a single IntersectionObserver toggles a CSS transition. Honors
 *  prefers-reduced-motion. */
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
  as?: Tag;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "-10% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Comp = as as "div";

  if (mask) {
    const Inner = as === "span" ? "span" : "span";
    return (
      <span
        ref={ref as React.Ref<HTMLSpanElement>}
        className="mask-line"
      >
        <Inner
          className={cn("block will-change-transform", className)}
          style={{
            transform: shown ? "translateY(0)" : "translateY(110%)",
            transition: `transform 1s ${EASE}`,
            transitionDelay: `${delay}s`,
          }}
        >
          {children}
        </Inner>
      </span>
    );
  }

  return (
    <Comp
      ref={ref as React.Ref<HTMLDivElement>}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : transformFor(direction),
        transition: `opacity 0.9s ${EASE}, transform 0.9s ${EASE}`,
        transitionDelay: `${delay}s`,
      }}
    >
      {children}
    </Comp>
  );
}
