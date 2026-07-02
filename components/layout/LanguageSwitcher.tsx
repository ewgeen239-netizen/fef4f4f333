"use client";

import { usePathname, useRouter } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

/** Swaps the leading /:lang segment, keeps the rest of the path. */
export default function LanguageSwitcher({
  current,
  className,
}: {
  current: Locale;
  className?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const swap = (next: Locale) => {
    const rest = pathname.replace(/^\/[^/]+/, "");
    router.push(`/${next}${rest || ""}`);
  };

  return (
    <div className={cn("flex items-center gap-2 text-xs uppercase tracking-editorial", className)}>
      {locales.map((l, i) => (
        <span key={l} className="flex items-center gap-2">
          {i > 0 && <span className="text-brass-dim/50">/</span>}
          <button
            type="button"
            onClick={() => swap(l)}
            aria-current={l === current ? "true" : undefined}
            className={cn(
              "transition-colors duration-300 hover:text-brass",
              l === current ? "text-brass" : "text-bone-dim"
            )}
          >
            {l}
          </button>
        </span>
      ))}
    </div>
  );
}
