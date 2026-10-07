import crypto from 'crypto';

const SESSION_COOKIE = 'nexo_admin_session';
const DOC_SESSION_COOKIE = 'nexo_doc_session';
const SESSION_TTL_MS = 24 * 60 * 60 * 1000;

const adminUser = process.env.ADMIN_USERNAME ?? 'admin';
const adminPassword = process.env.ADMIN_PASSWORD ?? 'lmujica';
const sessionSecret = process.env.ADMIN_SESSION_SECRET ?? 'nexo-dev-session-secret';

const docUser = process.env.DOC_API_USERNAME ?? 'doc';
const docPassword = process.env.DOC_API_PASSWORD ?? '';
const docUsersEnv = (process.env.DOC_API_USERS ?? '').trim();

function listDocApiAccountsExpress() {
  if (docUsersEnv.length > 0) {
    const accounts = docUsersEnv
      .split(',')
      .map((pair) => pair.trim())
      .filter(Boolean)
      .map((pair) => {
        const sep = pair.indexOf(':');
        if (sep <= 0) return null;
        return {
          username: pair.slice(0, sep).trim(),
          password: pair.slice(sep + 1),
        };
      })
      .filter(Boolean);
    if (accounts.length > 0) return accounts;
  }
  if (!docPassword.length) return [];
  if (docUser.includes(',') && docPassword.includes(',')) {
    const users = docUser.split(',').map((s) => s.trim()).filter(Boolean);
    const passwords = docPassword.split(',').map((s) => s.trim());
    if (users.length === passwords.length && users.length > 0) {
      return users.map((username, i) => ({ username, password: passwords[i] }));
    }
  }
  return [{ username: docUser.trim(), password: docPassword }];
}

/** Si hay cuentas configuradas, /doc/api exige login (cookie o sesión admin). */
const docApiProtectEnabled = listDocApiAccountsExpress().length > 0;

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

function setSessionCookie(res, token, cookieName = SESSION_COOKIE) {
  const maxAge = Math.floor(SESSION_TTL_MS / 1000);
  res.setHeader(
    'Set-Cookie',
    `${cookieName}=${encodeURIComponent(token)}; HttpOnly; Path=/; Max-Age=${maxAge}; SameSite=Lax`,
  );
}

function clearSessionCookie(res, cookieName = SESSION_COOKIE) {
  res.setHeader('Set-Cookie', `${cookieName}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`);
}

function getDocSessionFromRequest(req) {
  const cookies = parseCookies(req);
  return verifySessionToken(cookies[DOC_SESSION_COOKIE]);
}

function validateDocCredentials(username, password) {
  if (!docApiProtectEnabled) return false;
  return listDocApiAccountsExpress().some(
    (account) => account.username === username && account.password === password,
  );
}

/** Acceso a documentación API: abierto si no hay DOC_API_PASSWORD; si no, cookie doc o sesión admin. */
function getDocApiAccess(req) {
  if (!docApiProtectEnabled) {
    return { ok: true, user: null, mode: 'open' };
  }

  const adminSession = getSessionFromRequest(req);
  if (adminSession) {
    return { ok: true, user: adminSession.user, mode: 'admin' };
  }

  const docSession = getDocSessionFromRequest(req);
  if (docSession) {
    return { ok: true, user: docSession.user, mode: 'doc' };
  }

  return { ok: false };
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
  DOC_SESSION_COOKIE,
  clearSessionCookie,
  createSessionToken,
  docApiProtectEnabled,
  getDocApiAccess,
  getDocSessionFromRequest,
  getSessionFromRequest,
  requireAdmin,
  setSessionCookie,
  validateAdminCredentials,
  validateDocCredentials,
};
