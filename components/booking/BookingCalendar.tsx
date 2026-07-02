"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { toISODate } from "@/lib/utils";
import { cn } from "@/lib/utils";

export type SlotMap = Record<string, string[]>; // "YYYY-MM-DD" -> ["10:00", …]

type Labels = { noSlots: string; pickDate: string; loading: string };

const WEEKDAYS = ["Pn", "Wt", "Śr", "Cz", "Pt", "So", "Nd"];

function monthKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

/** Self-hosted availability calendar. Fetches open slots per visible month
 *  from GET /api/availability and reports the chosen date+slot upward. */
export default function BookingCalendar({
  value,
  onSelect,
  labels,
  monthNames,
}: {
  value: { date: string; timeSlot: string } | null;
  onSelect: (date: string, timeSlot: string) => void;
  labels: Labels;
  monthNames: string[];
}) {
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const [cursor, setCursor] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [slots, setSlots] = useState<SlotMap>({});
  const [loading, setLoading] = useState(false);
  const [activeDate, setActiveDate] = useState<string | null>(value?.date ?? null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`/api/availability?month=${monthKey(cursor)}`)
      .then((r) => (r.ok ? r.json() : {}))
      .then((data: SlotMap) => !cancelled && setSlots(data))
      .catch(() => !cancelled && setSlots({}))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [cursor]);

  // Build grid cells (Mon-first)
  const cells = useMemo(() => {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const first = new Date(year, month, 1);
    const startPad = (first.getDay() + 6) % 7; // Mon=0
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const out: (Date | null)[] = [];
    for (let i = 0; i < startPad; i++) out.push(null);
    for (let d = 1; d <= daysInMonth; d++) out.push(new Date(year, month, d));
    return out;
  }, [cursor]);

  const canGoBack = cursor > new Date(today.getFullYear(), today.getMonth(), 1);

  const activeSlots = activeDate ? slots[activeDate] ?? [] : null;

  return (
    <div>
      {/* Month header */}
      <div className="mb-6 flex items-center justify-between">
        <button
          type="button"
          onClick={() => canGoBack && setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
          disabled={!canGoBack}
          aria-label="Poprzedni miesiąc"
          className="p-2 text-bone-dim transition-colors hover:text-brass disabled:opacity-20"
        >
          ←
        </button>
        <h3 className="font-serif text-2xl">
          {monthNames[cursor.getMonth()]} {cursor.getFullYear()}
        </h3>
        <button
          type="button"
          onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
          aria-label="Następny miesiąc"
          className="p-2 text-bone-dim transition-colors hover:text-brass"
        >
          →
        </button>
      </div>

      {/* Weekday row */}
      <div className="mb-2 grid grid-cols-7 gap-1 text-center text-[10px] uppercase tracking-editorial text-bone-dim">
        {WEEKDAYS.map((w) => (
          <span key={w}>{w}</span>
        ))}
      </div>

      {/* Day grid */}
      <div className={cn("grid grid-cols-7 gap-1 transition-opacity", loading && "opacity-40")}>
        {cells.map((d, i) => {
          if (!d) return <span key={`e${i}`} />;
          const iso = toISODate(d);
          const past = d < today;
          const has = (slots[iso]?.length ?? 0) > 0;
          const isActive = activeDate === iso;
          const disabled = past || !has;
          return (
            <button
              key={iso}
              type="button"
              disabled={disabled}
              onClick={() => setActiveDate(iso)}
              aria-pressed={isActive}
              className={cn(
                "relative flex aspect-square items-center justify-center rounded-full text-sm transition-colors duration-200",
                disabled && "cursor-not-allowed text-bone-dim/30",
                !disabled && "text-bone hover:bg-white/5",
                isActive && "bg-brass text-ink hover:bg-brass"
              )}
            >
              {d.getDate()}
              {has && !isActive && (
                <span className="absolute bottom-1.5 h-1 w-1 rounded-full bg-brass" />
              )}
            </button>
          );
        })}
      </div>

      {/* Slots */}
      <div className="mt-8 min-h-[64px]">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.p key="l" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm text-bone-dim">
              {labels.loading}
            </motion.p>
          ) : !activeDate ? (
            <motion.p key="p" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm text-bone-dim">
              {labels.pickDate}
            </motion.p>
          ) : activeSlots && activeSlots.length > 0 ? (
            <motion.div
              key={activeDate}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-wrap gap-2"
            >
              {activeSlots.map((s) => {
                const sel = value?.date === activeDate && value?.timeSlot === s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => onSelect(activeDate, s)}
                    aria-pressed={sel}
                    className={cn(
                      "rounded-full border px-5 py-2 text-sm tabular-nums transition-colors duration-200",
                      sel
                        ? "border-brass bg-brass text-ink"
                        : "border-white/15 text-bone hover:border-brass"
                    )}
                  >
                    {s}
                  </button>
                );
              })}
            </motion.div>
          ) : (
            <motion.p key="n" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm text-bone-dim">
              {labels.noSlots}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
