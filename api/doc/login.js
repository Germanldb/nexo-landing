import {
  buildSessionCookie,
  createSessionToken,
  docApiProtectEnabled,
  DOC_SESSION_COOKIE,
  getSessionSecret,
  SESSION_TTL_MS,
  validateDocCredentials,
} from '../../lib/doc-session.js';

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
    });
    req.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        reject(new Error('JSON inválido'));
      }
    });
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.end('Method Not Allowed');
    return;
  }

  if (!docApiProtectEnabled()) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ ok: false, message: 'Documentación API abierta (sin contraseña configurada).' }));
    return;
  }

  let body;
  try {
    body = await readJsonBody(req);
  } catch {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ ok: false, message: 'Cuerpo JSON inválido.' }));
    return;
  }

  const username = typeof body.username === 'string' ? body.username.trim() : '';
  const password = typeof body.password === 'string' ? body.password : '';

  const adminUser = process.env.ADMIN_USERNAME ?? 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD ?? '';

  const viaDoc = validateDocCredentials(username, password);
  const viaAdmin =
    adminPassword.length > 0 && username === adminUser && password === adminPassword;

  if (!viaDoc && !viaAdmin) {
    res.statusCode = 401;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ ok: false, message: 'Usuario o contraseña incorrectos.' }));
    return;
  }

  const token = await createSessionToken(username, getSessionSecret());
  const maxAge = Math.floor(SESSION_TTL_MS / 1000);
  res.setHeader('Set-Cookie', buildSessionCookie(DOC_SESSION_COOKIE, token, maxAge));
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ ok: true, user: username }));
}
