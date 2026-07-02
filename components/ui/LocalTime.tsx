"use client";

import { useEffect, useState } from "react";

/** Live "Szczecin · HH:MM" indicator in Europe/Warsaw time. */
export default function LocalTime({ prefix = "Szczecin" }: { prefix?: string }) {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("pl-PL", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Europe/Warsaw",
      hour12: false,
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000 * 15);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="tabular-nums text-bone-dim" suppressHydrationWarning>
      {prefix} · {time || "--:--"}
    </span>
  );
}
