"use client";

import { useEffect } from "react";

// Lightweight Cal.com inline embed loader (no extra npm dep). Enabled when
// BOOKING_PROVIDER=calcom. Confirmed bookings arrive via /api/booking/webhook.
declare global {
  interface Window {
    Cal?: ((...args: unknown[]) => void) & { loaded?: boolean; ns?: Record<string, unknown> };
  }
}

export default function CalcomEmbed({ calLink }: { calLink: string }) {
  useEffect(() => {
    (function (C: Window, A: string, L: string) {
      const p = (a: any, ar: unknown) => a.q.push(ar);
      const d = C.document;
      C.Cal =
        C.Cal ||
        function (...args: unknown[]) {
          const cal = C.Cal!;
          if (!cal.loaded) {
            (cal as any).ns = {};
            (cal as any).q = (cal as any).q || [];
            const s = d.createElement("script");
            s.src = A;
            d.head.appendChild(s);
            cal.loaded = true;
          }
          if (args[0] === L) {
            const api: any = function (...a: unknown[]) { p(api, a); };
            api.q = api.q || [];
            (cal as any).ns[args[1] as string] = api;
            p(api, args);
            return;
          }
          p(cal, args);
        };
    })(window, "https://app.cal.com/embed/embed.js", "init");

    window.Cal!("init", { origin: "https://cal.com" });
    window.Cal!("inline", {
      elementOrSelector: "#cal-inline",
      calLink,
      config: { theme: "dark" },
    });
    window.Cal!("ui", {
      theme: "dark",
      cssVarsPerTheme: { dark: { "cal-brand": "#B8A88F" } },
      hideEventTypeDetails: false,
    });
  }, [calLink]);

  return <div id="cal-inline" className="min-h-[640px] w-full" />;
}
