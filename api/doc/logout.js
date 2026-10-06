import { buildClearCookie, DOC_SESSION_COOKIE } from '../../lib/doc-session.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.end('Method Not Allowed');
    return;
  }

  res.setHeader('Set-Cookie', buildClearCookie(DOC_SESSION_COOKIE));
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ ok: true }));
}
