import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toISODate } from "@/lib/utils";

export const dynamic = "force-dynamic";

// GET /api/availability?month=YYYY-MM
// → { "2026-07-02": ["10:00","12:30"], … } open slots, future only.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const month = searchParams.get("month");
  const m = month?.match(/^(\d{4})-(\d{2})$/);
  if (!m) return NextResponse.json({ error: "bad month" }, { status: 400 });

  const year = Number(m[1]);
  const mon = Number(m[2]) - 1;
  const start = new Date(year, mon, 1);
  const end = new Date(year, mon + 1, 1);

  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const lower = start > now ? start : now;

  const rows = await prisma.availability.findMany({
    where: { date: { gte: lower, lt: end }, isBooked: false },
    orderBy: [{ date: "asc" }, { timeSlot: "asc" }],
    select: { date: true, timeSlot: true },
  });

  const map: Record<string, string[]> = {};
  for (const r of rows) {
    const key = toISODate(r.date);
    (map[key] ??= []).push(r.timeSlot);
  }

  return NextResponse.json(map, {
    headers: { "Cache-Control": "no-store" },
  });
}
