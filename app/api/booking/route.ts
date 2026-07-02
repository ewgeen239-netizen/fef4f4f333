import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { bookingSchema } from "@/lib/validations/booking";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { sendBookingEmails, sendTelegram } from "@/lib/notify";

export const runtime = "nodejs";

// POST /api/booking — validate, atomically reserve the slot, notify.
export async function POST(req: Request) {
  // Rate limit: 5 / min / IP
  const ip = clientIp(req);
  if (!rateLimit(`booking:${ip}`, { limit: 5, windowMs: 60_000 }).ok) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_json" }, { status: 400 });
  }

  const parsed = bookingSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation", issues: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const data = parsed.data;

  // Honeypot tripped → pretend success, persist nothing.
  if (data.company && data.company.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const dateOnly = new Date(`${data.date}T00:00:00.000Z`);

  try {
    // Atomic: lock the slot then create the booking in one transaction.
    const booking = await prisma.$transaction(async (tx) => {
      const slot = await tx.availability.findUnique({
        where: { date_timeSlot: { date: dateOnly, timeSlot: data.timeSlot } },
      });
      if (!slot) throw new Error("SLOT_NOT_FOUND");
      if (slot.isBooked) throw new Error("SLOT_TAKEN");

      // Flip only if still free (guards against race between read and write).
      const claimed = await tx.availability.updateMany({
        where: { id: slot.id, isBooked: false },
        data: { isBooked: true },
      });
      if (claimed.count === 0) throw new Error("SLOT_TAKEN");

      return tx.booking.create({
        data: {
          name: data.name,
          contact: data.contact,
          sessionType: data.sessionType,
          date: dateOnly,
          timeSlot: data.timeSlot,
          location: data.location || null,
          message: data.message || null,
          status: "PENDING",
          availabilityId: slot.id,
        },
      });
    });

    // Fire-and-forget notifications (don't block the response on email).
    const payload = {
      name: booking.name,
      contact: booking.contact,
      sessionType: booking.sessionType,
      date: data.date,
      timeSlot: booking.timeSlot,
      location: booking.location,
      message: booking.message,
    };
    await Promise.allSettled([sendBookingEmails(payload), sendTelegram(payload)]);

    return NextResponse.json({ ok: true, id: booking.id }, { status: 201 });
  } catch (err) {
    if (err instanceof Error && (err.message === "SLOT_TAKEN" || err.message === "SLOT_NOT_FOUND")) {
      return NextResponse.json({ error: err.message.toLowerCase() }, { status: 409 });
    }
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return NextResponse.json({ error: "slot_taken" }, { status: 409 });
    }
    console.error("[booking]", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
