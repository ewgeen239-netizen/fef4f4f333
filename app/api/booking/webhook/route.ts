import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { prisma } from "@/lib/prisma";
import { sendBookingEmails, sendTelegram } from "@/lib/notify";
import { toISODate } from "@/lib/utils";

export const runtime = "nodejs";

// POST /api/booking/webhook — Cal.com webhook receiver.
// Verifies HMAC signature, persists CONFIRMED bookings, notifies.
export async function POST(req: Request) {
  const secret = process.env.CALCOM_WEBHOOK_SECRET;
  const raw = await req.text();

  if (secret) {
    const sig = req.headers.get("x-cal-signature-256") ?? "";
    const expected = crypto.createHmac("sha256", secret).update(raw).digest("hex");
    const ok =
      sig.length === expected.length &&
      crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
    if (!ok) return NextResponse.json({ error: "bad_signature" }, { status: 401 });
  }

  let event: any;
  try {
    event = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "bad_json" }, { status: 400 });
  }

  const trigger = event.triggerEvent as string;
  const p = event.payload ?? {};

  // Map Cal.com session type by event title/slug if you configure one per package.
  const sessionType = mapType(p.eventType?.slug ?? p.type ?? "");
  const start = p.startTime ? new Date(p.startTime) : new Date();
  const attendee = p.attendees?.[0] ?? {};
  const externalId: string = String(p.uid ?? p.bookingId ?? crypto.randomUUID());

  try {
    if (trigger === "BOOKING_CANCELLED") {
      await prisma.booking.updateMany({
        where: { externalId },
        data: { status: "CANCELLED" },
      });
      return NextResponse.json({ ok: true });
    }

    if (trigger === "BOOKING_CREATED" || trigger === "BOOKING_CONFIRMED") {
      const booking = await prisma.booking.upsert({
        where: { externalId },
        update: { status: "CONFIRMED" },
        create: {
          externalId,
          name: attendee.name ?? "—",
          contact: attendee.email ?? "—",
          sessionType,
          date: new Date(`${toISODate(start)}T00:00:00.000Z`),
          timeSlot: start.toISOString().slice(11, 16),
          location: p.location ?? null,
          message: p.additionalNotes ?? null,
          status: "CONFIRMED",
        },
      });

      const payload = {
        name: booking.name,
        contact: booking.contact,
        sessionType: booking.sessionType,
        date: toISODate(booking.date),
        timeSlot: booking.timeSlot,
        location: booking.location,
        message: booking.message,
      };
      await Promise.allSettled([sendBookingEmails(payload), sendTelegram(payload)]);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[webhook]", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}

function mapType(slug: string): "PERSONAL" | "LOVE_FAMILY" {
  const s = slug.toLowerCase();
  if (s.includes("love") || s.includes("family") || s.includes("famil")) return "LOVE_FAMILY";
  return "PERSONAL";
}
