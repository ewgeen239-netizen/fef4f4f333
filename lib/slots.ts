// Shared availability config + a DB-less fallback generator.
// When DATABASE_URL is set the app uses the Prisma Availability table;
// otherwise it generates open weekday slots on the fly so the booking
// calendar still works (email-only mode, no persistence / no locking).

import { toISODate } from "./utils";

export const SLOTS = ["10:00", "12:30", "15:00", "17:30"];
export const DAYS_AHEAD = 60;

export function hasDatabase(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

/** Open slots for a given month (0-based), future weekdays only.
 *  Mirrors prisma/seed.ts so both modes behave the same. */
export function generateMonthSlots(year: number, month0: number): Record<string, string[]> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const map: Record<string, string[]> = {};
  const daysInMonth = new Date(year, month0 + 1, 0).getDate();

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month0, d);
    if (date < today) continue; // past
    const day = date.getDay();
    if (day === 0 || day === 6) continue; // weekend
    map[toISODate(date)] = [...SLOTS];
  }
  return map;
}
