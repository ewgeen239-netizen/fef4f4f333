"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

// Always open a page from the very top — on route change AND on reload.
// Disables the browser's scroll restoration and resets both the native
// scroll and the Lenis instance.
export default function ScrollTop() {
  const pathname = usePathname();

  // Reload / first mount: force top and turn off restoration.
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, []);

  // Every navigation: jump to top immediately (no smooth-scroll animation).
  useEffect(() => {
    window.__lenis?.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
