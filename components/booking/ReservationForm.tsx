"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { bookingSchema, type BookingInput } from "@/lib/validations/booking";
import BookingCalendar from "./BookingCalendar";
import { cn } from "@/lib/utils";

type ContactDict = {
  calendarTitle: string;
  noSlots: string;
  pickDate: string;
  form: {
    name: string;
    contact: string;
    sessionType: string;
    date: string;
    timeSlot: string;
    location: string;
    message: string;
    submit: string;
    selectType: string;
    types: Record<string, string>;
  };
  success: { title: string; body: string };
  error: string;
  validation: Record<string, string>;
};

type State = "idle" | "loading" | "success" | "error";

export default function ReservationForm({
  dict,
  loadingLabel,
  monthNames,
  initialType,
}: {
  dict: ContactDict;
  loadingLabel: string;
  monthNames: string[];
  initialType?: string;
}) {
  const [state, setState] = useState<State>("idle");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BookingInput>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      sessionType: (initialType as BookingInput["sessionType"]) ?? undefined,
      date: "",
      timeSlot: "",
      company: "",
    },
  });

  const date = watch("date");
  const timeSlot = watch("timeSlot");

  const v = (key?: string) => (key ? dict.validation[key] ?? " " : undefined);

  async function onSubmit(data: BookingInput) {
    setState("loading");
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(await res.text());
      setState("success");
    } catch {
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="flex min-h-[420px] flex-col items-center justify-center border border-brass/30 p-12 text-center"
      >
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
          className="mb-8 flex h-16 w-16 items-center justify-center rounded-full border border-brass text-2xl text-brass"
          aria-hidden
        >
          ✓
        </motion.span>
        <h3 className="font-serif text-4xl">{dict.success.title}</h3>
        <p className="mt-4 max-w-sm text-bone-dim text-pretty">{dict.success.body}</p>
      </motion.div>
    );
  }

  const inputCls =
    "w-full border-b border-white/15 bg-transparent py-3 text-bone placeholder:text-bone-dim/50 transition-colors focus:border-brass focus:outline-none";
  const labelCls = "text-[11px] uppercase tracking-editorial text-brass-dim";

  return (
    <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
      {/* Calendar */}
      <div>
        <h2 className="mb-8 text-[11px] uppercase tracking-editorial text-brass">
          {dict.calendarTitle}
        </h2>
        <BookingCalendar
          value={date && timeSlot ? { date, timeSlot } : null}
          onSelect={(d, s) => {
            setValue("date", d, { shouldValidate: true });
            setValue("timeSlot", s, { shouldValidate: true });
          }}
          labels={{ noSlots: dict.noSlots, pickDate: dict.pickDate, loading: loadingLabel }}
          monthNames={monthNames}
        />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8" aria-live="polite">
        {/* Honeypot — visually hidden, off tab order */}
        <div className="absolute h-0 w-0 overflow-hidden" aria-hidden>
          <label>
            Company
            <input type="text" tabIndex={-1} autoComplete="off" {...register("company")} />
          </label>
        </div>

        <div>
          <label className={labelCls} htmlFor="name">{dict.form.name}</label>
          <input id="name" className={inputCls} {...register("name")} aria-invalid={!!errors.name} />
          {errors.name && <p className="mt-2 text-xs text-brass">{v(errors.name.message)}</p>}
        </div>

        <div>
          <label className={labelCls} htmlFor="contact">{dict.form.contact}</label>
          <input id="contact" className={inputCls} {...register("contact")} aria-invalid={!!errors.contact} />
          {errors.contact && <p className="mt-2 text-xs text-brass">{v(errors.contact.message)}</p>}
        </div>

        <div>
          <label className={labelCls} htmlFor="sessionType">{dict.form.sessionType}</label>
          <select
            id="sessionType"
            className={cn(inputCls, "appearance-none")}
            defaultValue={initialType ?? ""}
            {...register("sessionType")}
            aria-invalid={!!errors.sessionType}
          >
            <option value="" disabled className="bg-ink">{dict.form.selectType}</option>
            {Object.entries(dict.form.types).map(([val, label]) => (
              <option key={val} value={val} className="bg-ink">{label}</option>
            ))}
          </select>
          {errors.sessionType && <p className="mt-2 text-xs text-brass">{v(errors.sessionType.message)}</p>}
        </div>

        {/* Chosen slot mirror (readonly, driven by calendar) */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <span className={labelCls}>{dict.form.date}</span>
            <p className="border-b border-white/15 py-3 tabular-nums text-bone">{date || "—"}</p>
            {errors.date && <p className="mt-2 text-xs text-brass">{v(errors.date.message)}</p>}
          </div>
          <div>
            <span className={labelCls}>{dict.form.timeSlot}</span>
            <p className="border-b border-white/15 py-3 tabular-nums text-bone">{timeSlot || "—"}</p>
            {errors.timeSlot && <p className="mt-2 text-xs text-brass">{v(errors.timeSlot.message)}</p>}
          </div>
        </div>

        <div>
          <label className={labelCls} htmlFor="location">{dict.form.location}</label>
          <input id="location" className={inputCls} {...register("location")} />
        </div>

        <div>
          <label className={labelCls} htmlFor="message">{dict.form.message}</label>
          <textarea id="message" rows={3} className={cn(inputCls, "resize-none")} {...register("message")} />
        </div>

        <AnimatePresence>
          {state === "error" && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="text-sm text-brass"
              role="alert"
            >
              {dict.error}
            </motion.p>
          )}
        </AnimatePresence>

        <button
          type="submit"
          disabled={state === "loading"}
          className="group relative w-full overflow-hidden rounded-full border border-brass/40 py-4 text-xs uppercase tracking-editorial text-bone transition-colors duration-500 hover:bg-brass hover:text-ink disabled:opacity-50"
        >
          {state === "loading" ? loadingLabel : dict.form.submit}
        </button>
      </form>
    </div>
  );
}
