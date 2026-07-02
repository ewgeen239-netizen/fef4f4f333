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

/** Open slots for a given month (0-based). Visual-request mode: every future
 *  day is available (incl. weekends); only past days are closed. */
export function generateMonthSlots(year: number, month0: number): Record<string, string[]> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const map: Record<string, string[]> = {};
  const daysInMonth = new Date(year, month0 + 1, 0).getDate();

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month0, d);
    if (date < today) continue; // past days closed
    map[toISODate(date)] = [...SLOTS];
  }
  return map;
}
