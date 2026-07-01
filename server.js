import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const root = process.cwd();
const port = Number(process.env.PORT || 3000);
const botToken = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;
const defaultSiteOrigin = process.env.SITE_ORIGIN || 'https://krasnovskaph.up.railway.app';

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

function getServiceDetails(sessionType) {
  const services = {
    portrait: {
      label: 'Фотосессия',
      price: '200 zł / час',
      photo: '/images/lead-portrait.png'
    },
    brand: {
      label: 'Фотосессия',
      price: '200 zł / час',
      photo: '/images/lead-portrait.png'
    },
    event: {
      label: 'Фотосессия',
      price: '200 zł / час',
      photo: '/images/lead-portrait.png'
    },
    other: {
      label: 'Фотосессия',
      price: '200 zł / час',
      photo: '/images/lead-portrait.png'
    },
    love: {
      label: 'Love story / семейная',
      price: '250 zł / час',
      photo: '/images/lead-love-family.png'
    }
  };

  return services[sessionType] || {
    label: sessionType || 'Не выбрано',
    price: 'Уточнить',
    photo: '/images/lead-portrait.png'
  };
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
  const fullMessage = trimField(data.message, 1200);
  const message = fullMessage.length > 360 ? `${fullMessage.slice(0, 360).trim()}...` : fullMessage;
  const language = trimField(data.language, 20) || 'unknown';
  const page = trimField(data.page, 300);
  const referrer = trimField(data.referrer, 300) || 'direct';
  const service = getServiceDetails(sessionType);
  const photoUrl = new URL(service.photo, defaultSiteOrigin).toString();

  if (!name || !contact || !fullMessage) {
    const err = new Error('missing_required_fields');
    err.statusCode = 400;
    throw err;
  }

  const text = [
    '📸 <b>Новая заявка Krasnovska PH</b>',
    '━━━━━━━━━━━━━━',
    '',
    `✨ <b>Услуга:</b> ${escapeHtml(service.label)}`,
    `💰 <b>Цена:</b> ${escapeHtml(service.price)}`,
    `🗂 <b>Тип из формы:</b> ${escapeHtml(sessionType)}`,
    '',
    `👤 <b>Имя:</b> ${escapeHtml(name)}`,
    `📲 <b>Контакт:</b> ${escapeHtml(contact)}`,
    `📍 <b>Дата / город:</b> ${escapeHtml(dateCity)}`,
    `🌐 <b>Язык сайта:</b> ${escapeHtml(language)}`,
    '',
    `💬 <b>Сообщение:</b>\n${escapeHtml(message)}`,
    '',
    `🔗 <b>Страница:</b> ${escapeHtml(page)}`,
    `↩️ <b>Источник:</b> ${escapeHtml(referrer)}`
  ].join('\n');

  const photoResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      photo: photoUrl,
      caption: text,
      parse_mode: 'HTML',
      disable_web_page_preview: true
    })
  });

  if (photoResponse.ok) {
    if (fullMessage !== message) {
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: `💬 <b>Полное сообщение клиента:</b>\n${escapeHtml(fullMessage)}`,
          parse_mode: 'HTML',
          disable_web_page_preview: true
        })
      });
    }
    return;
  }

  const messageResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: `${text}\n\n🖼 <b>Фото услуги:</b> ${escapeHtml(photoUrl)}`,
      parse_mode: 'HTML',
      disable_web_page_preview: true
    })
  });

  if (!messageResponse.ok) {
    throw new Error(`telegram_send_failed_${messageResponse.status}`);
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
  const routes = {
    '/': '/index.html',
    '/studio': '/studio.html',
    '/portfolio': '/portfolio.html',
    '/services': '/services.html',
    '/process': '/process.html',
    '/contact': '/contact.html'
  };
  const pathname = routes[url.pathname] || url.pathname;

  if (!pathname.endsWith('.html') && !pathname.startsWith('/images/') && !pathname.endsWith('.js')) {
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
      'Cache-Control': pathname.endsWith('.html') ? 'no-cache' : 'public, max-age=31536000, immutable'
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
