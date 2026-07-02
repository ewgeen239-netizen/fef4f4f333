"use client";

import Image from "next/image";
import { useState } from "react";
import type { Work } from "@/lib/portfolio";
import { cn } from "@/lib/utils";

/** Image with blur placeholder, hover zoom, fade-in on load. */
export default function WorkImage({
  work,
  sizes = "(max-width: 768px) 100vw, 33vw",
  priority = false,
  className,
}: {
  work: Work;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={cn("group relative aspect-[3/4] overflow-hidden bg-ink-soft", className)}>
      <Image
        src={work.src}
        alt={work.alt}
        fill
        sizes={sizes}
        priority={priority}
        placeholder="blur"
        blurDataURL={work.blurDataURL}
        onLoad={() => setLoaded(true)}
        className={cn(
          "object-cover transition-all duration-[1200ms] ease-editorial group-hover:scale-105",
          loaded ? "opacity-100 blur-0" : "opacity-0 blur-sm"
        )}
      />
    </div>
  );
}
