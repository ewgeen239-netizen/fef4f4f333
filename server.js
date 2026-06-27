import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const root = process.cwd();
const port = Number(process.env.PORT || 3000);
const botToken = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

function sendJson(res, status, payload) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store'
  });
  res.end(JSON.stringify(payload));
}

function escapeHtml(value) {
  return String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function trimField(value, max = 800) {
  return String(value || '').trim().slice(0, max);
}

async function readJsonBody(req) {
  let raw = '';
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > 32_000) throw new Error('payload_too_large');
  }
  return JSON.parse(raw || '{}');
}

async function sendTelegramLead(data) {
  if (!botToken || !chatId) {
    throw new Error('telegram_not_configured');
  }

  const name = trimField(data.name, 120);
  const contact = trimField(data.contact, 180);
  const sessionType = trimField(data.sessionType, 120) || 'not selected';
  const dateCity = trimField(data.dateCity, 160) || 'not specified';
  const message = trimField(data.message, 1200);
  const language = trimField(data.language, 20) || 'unknown';
  const page = trimField(data.page, 300);
  const referrer = trimField(data.referrer, 300) || 'direct';

  if (!name || !contact || !message) {
    const err = new Error('missing_required_fields');
    err.statusCode = 400;
    throw err;
  }

  const text = [
    '<b>New Krasnovska PH booking request</b>',
    '',
    `<b>Name:</b> ${escapeHtml(name)}`,
    `<b>Contact:</b> ${escapeHtml(contact)}`,
    `<b>Session:</b> ${escapeHtml(sessionType)}`,
    `<b>Date / city:</b> ${escapeHtml(dateCity)}`,
    `<b>Language:</b> ${escapeHtml(language)}`,
    '',
    `<b>Message:</b>\n${escapeHtml(message)}`,
    '',
    `<b>Page:</b> ${escapeHtml(page)}`,
    `<b>Referrer:</b> ${escapeHtml(referrer)}`
  ].join('\n');

  const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
      disable_web_page_preview: true
    })
  });

  if (!response.ok) {
    throw new Error(`telegram_send_failed_${response.status}`);
  }
}

async function handleLead(req, res) {
  if (req.method !== 'POST') {
    sendJson(res, 405, { ok: false, error: 'method_not_allowed' });
    return;
  }

  try {
    const data = await readJsonBody(req);
    await sendTelegramLead(data);
    sendJson(res, 200, { ok: true });
  } catch (error) {
    const status = error.statusCode || (error.message === 'payload_too_large' ? 413 : 500);
    sendJson(res, status, { ok: false, error: error.message || 'lead_failed' });
  }
}

async function serveStatic(req, res) {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname === '/' ? '/index.html' : url.pathname;

  if (pathname !== '/index.html' && !pathname.startsWith('/images/')) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not found');
    return;
  }

  const safePath = normalize(decodeURIComponent(pathname)).replace(/^(\.\.[/\\])+/, '');
  const filePath = join(root, safePath);

  if (!filePath.startsWith(root)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  try {
    const body = await readFile(filePath);
    res.writeHead(200, {
      'Content-Type': mimeTypes[extname(filePath)] || 'application/octet-stream',
      'Cache-Control': pathname === '/index.html' ? 'no-cache' : 'public, max-age=31536000, immutable'
    });
    res.end(body);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not found');
  }
}

createServer((req, res) => {
  if (req.url?.startsWith('/api/lead')) {
    handleLead(req, res);
    return;
  }
  serveStatic(req, res);
}).listen(port, () => {
  console.log(`Krasnovska PH listening on ${port}`);
});
