import { z } from "zod";

export const SESSION_TYPES = ["PERSONAL", "LOVE_FAMILY"] as const;

// Accept either a valid email or a plausible phone number.
const emailOrPhone = z
  .string()
  .trim()
  .min(5, "contact")
  .refine((v) => {
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    const isPhone = /^[+()\d\s-]{7,20}$/.test(v);
    return isEmail || isPhone;
  }, "contact");

export const bookingSchema = z.object({
  name: z.string().trim().min(2, "name").max(120),
  contact: emailOrPhone,
  sessionType: z.enum(SESSION_TYPES, { message: "sessionType" }),
  // ISO date string "YYYY-MM-DD"
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date"),
  timeSlot: z.string().regex(/^\d{2}:\d{2}$/, "timeSlot"),
  location: z.string().trim().max(200).optional().or(z.literal("")),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
  // Honeypot — must stay empty. Bots fill it.
  company: z.string().max(0).optional(),
});

export type BookingInput = z.infer<typeof bookingSchema>;
