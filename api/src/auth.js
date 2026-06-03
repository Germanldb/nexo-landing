import crypto from 'crypto';

const SESSION_COOKIE = 'nexo_admin_session';
const SESSION_TTL_MS = 24 * 60 * 60 * 1000;

const adminUser = process.env.ADMIN_USERNAME ?? 'admin';
const adminPassword = process.env.ADMIN_PASSWORD ?? 'lmujica';
const sessionSecret = process.env.ADMIN_SESSION_SECRET ?? 'nexo-dev-session-secret';

function parseCookies(req) {
  const header = req.headers.cookie;
  if (!header) return {};

  return Object.fromEntries(
    header.split(';').map((part) => {
      const index = part.indexOf('=');
      if (index === -1) return [part.trim(), ''];
      const key = part.slice(0, index).trim();
      const value = part.slice(index + 1).trim();
      return [key, decodeURIComponent(value)];
    }),
  );
}

function signSession(payload) {
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', sessionSecret).update(data).digest('base64url');
  return `${data}.${signature}`;
}

function verifySessionToken(token) {
  if (!token) return null;

  const separator = token.lastIndexOf('.');
  if (separator === -1) return null;

  const data = token.slice(0, separator);
  const signature = token.slice(separator + 1);
  const expected = crypto.createHmac('sha256', sessionSecret).update(data).digest('base64url');

  if (signature !== expected) return null;

  try {
    const payload = JSON.parse(Buffer.from(data, 'base64url').toString('utf8'));
    if (!payload?.user || !payload?.exp || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

function createSessionToken(username) {
  return signSession({
    user: username,
    exp: Date.now() + SESSION_TTL_MS,
  });
}

function setSessionCookie(res, token) {
  const maxAge = Math.floor(SESSION_TTL_MS / 1000);
  res.setHeader(
    'Set-Cookie',
    `${SESSION_COOKIE}=${encodeURIComponent(token)}; HttpOnly; Path=/; Max-Age=${maxAge}; SameSite=Lax`,
  );
}

function clearSessionCookie(res) {
  res.setHeader('Set-Cookie', `${SESSION_COOKIE}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`);
}

function getSessionFromRequest(req) {
  const cookies = parseCookies(req);
  return verifySessionToken(cookies[SESSION_COOKIE]);
}

function validateAdminCredentials(username, password) {
  return username === adminUser && password === adminPassword;
}

function requireAdmin(req, res, next) {
  const session = getSessionFromRequest(req);
  if (!session) {
    return res.status(401).json({ ok: false, message: 'No autorizado' });
  }

  req.adminUser = session.user;
  return next();
}

export {
  SESSION_COOKIE,
  clearSessionCookie,
  createSessionToken,
  getSessionFromRequest,
  requireAdmin,
  setSessionCookie,
  validateAdminCredentials,
};
