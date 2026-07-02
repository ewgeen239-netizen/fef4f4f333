import { Resend } from "resend";

type NotifyPayload = {
  name: string;
  contact: string;
  sessionType: string;
  date: string;
  timeSlot: string;
  location?: string | null;
  message?: string | null;
};

const resendKey = process.env.RESEND_API_KEY;
const resend = resendKey ? new Resend(resendKey) : null;

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

/** Notify the photographer + auto-reply the client. Never throws. */
export async function sendBookingEmails(p: NotifyPayload): Promise<void> {
  if (!resend) {
    console.warn("[notify] RESEND_API_KEY missing — skipping email.");
    return;
  }
  const from = process.env.EMAIL_FROM ?? "Krasnovska PH <onboarding@resend.dev>";
  const owner = process.env.EMAIL_TO_OWNER;

  const summary = `
    <table style="font-family:Georgia,serif;color:#121110;font-size:15px;line-height:1.7">
      <tr><td style="padding:4px 16px 4px 0;color:#8f8168">Imię</td><td>${esc(p.name)}</td></tr>
      <tr><td style="padding:4px 16px 4px 0;color:#8f8168">Kontakt</td><td>${esc(p.contact)}</td></tr>
      <tr><td style="padding:4px 16px 4px 0;color:#8f8168">Sesja</td><td>${esc(p.sessionType)}</td></tr>
      <tr><td style="padding:4px 16px 4px 0;color:#8f8168">Termin</td><td>${esc(p.date)} · ${esc(p.timeSlot)}</td></tr>
      <tr><td style="padding:4px 16px 4px 0;color:#8f8168">Lokalizacja</td><td>${esc(p.location ?? "—")}</td></tr>
      <tr><td style="padding:4px 16px 4px 0;color:#8f8168;vertical-align:top">Wiadomość</td><td>${esc(p.message ?? "—")}</td></tr>
    </table>`;

  const jobs: Promise<unknown>[] = [];

  if (owner) {
    jobs.push(
      resend.emails.send({
        from,
        to: owner,
        replyTo: isEmail(p.contact) ? p.contact : undefined,
        subject: `Nowa rezerwacja — ${p.name} · ${p.date} ${p.timeSlot}`,
        html: `<h2 style="font-family:Georgia,serif;font-weight:400">Nowa rezerwacja</h2>${summary}`,
      })
    );
  }

  if (isEmail(p.contact)) {
    jobs.push(
      resend.emails.send({
        from,
        to: p.contact,
        subject: "Krasnovska PH — potwierdzenie rezerwacji",
        html: `
          <div style="font-family:Georgia,serif;color:#121110;max-width:520px">
            <h2 style="font-weight:400;letter-spacing:-0.02em">Dziękuję, ${esc(p.name)}.</h2>
            <p style="line-height:1.7">Otrzymałem Twoją prośbę o rezerwację. Odezwę się w ciągu 24 godzin, aby potwierdzić szczegóły.</p>
            ${summary}
            <p style="color:#8f8168;font-size:13px;margin-top:24px">Krasnovska PH · Szczecin</p>
          </div>`,
      })
    );
  }

  const results = await Promise.allSettled(jobs);
  results.forEach((r) => r.status === "rejected" && console.error("[notify]", r.reason));
}

/** Optional Telegram duplicate. Never throws. */
export async function sendTelegram(p: NotifyPayload): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chat = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chat) return;

  const text =
    `📸 *Nowa rezerwacja*\n\n` +
    `*${p.name}*\n${p.contact}\n\n` +
    `${p.sessionType} — ${p.date} ${p.timeSlot}\n` +
    `${p.location ? `📍 ${p.location}\n` : ""}` +
    `${p.message ? `\n_${p.message}_` : ""}`;

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chat, text, parse_mode: "Markdown" }),
    });
  } catch (e) {
    console.error("[telegram]", e);
  }
}

function esc(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!
  );
}
