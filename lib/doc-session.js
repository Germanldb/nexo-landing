/** Sesión doc API — compatible con Edge (middleware) y Node (Vercel Serverless). */

export const DOC_SESSION_COOKIE = 'nexo_doc_session';
export const ADMIN_SESSION_COOKIE = 'nexo_admin_session';
export const SESSION_TTL_MS = 24 * 60 * 60 * 1000;

export function getSessionSecret() {
  return (
    process.env.ADMIN_SESSION_SECRET ??
    process.env.DOC_SESSION_SECRET ??
    'nexo-dev-session-secret'
  );
}

/**
 * Cuentas doc API, en este orden de prioridad:
 * 1) DOC_API_USERS=user1:pass1,user2:pass2
 * 2) DOC_API_USERNAME=u1,u2 + DOC_API_PASSWORD=p1,p2 (mismo orden)
 * 3) Un solo DOC_API_USERNAME + DOC_API_PASSWORD
 */
export function listDocApiAccounts() {
  const usersEnv = (process.env.DOC_API_USERS ?? '').trim();
  if (usersEnv.length > 0) {
    const accounts = usersEnv
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

  const rawUsers = process.env.DOC_API_USERNAME ?? 'doc';
  const rawPasswords = process.env.DOC_API_PASSWORD ?? '';
  if (!rawPasswords.length) return [];

  if (rawUsers.includes(',') && rawPasswords.includes(',')) {
    const users = rawUsers.split(',').map((s) => s.trim()).filter(Boolean);
    const passwords = rawPasswords.split(',').map((s) => s.trim());
    if (users.length === passwords.length && users.length > 0) {
      return users.map((username, i) => ({ username, password: passwords[i] }));
    }
  }

  return [{ username: rawUsers.trim(), password: rawPasswords }];
}

export function docApiProtectEnabled() {
  return listDocApiAccounts().length > 0;
}

export function validateDocCredentials(username, password) {
  if (!docApiProtectEnabled()) return false;
  return listDocApiAccounts().some(
    (account) => account.username === username && account.password === password,
  );
}

export function parseCookieHeader(header) {
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

function encodeBase64Url(bytes) {
  const buffer =
    typeof bytes === 'string' ? new TextEncoder().encode(bytes) : bytes;
  let binary = '';
  for (const byte of buffer) binary += String.fromCharCode(byte);
  const b64 =
    typeof btoa === 'function'
      ? btoa(binary)
      : Buffer.from(buffer).toString('base64');
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function decodeBase64Url(data) {
  const padded = data.replace(/-/g, '+').replace(/_/g, '/');
  const pad = padded.length % 4 === 0 ? '' : '='.repeat(4 - (padded.length % 4));
  const b64 = padded + pad;
  if (typeof atob === 'function') {
    const binary = atob(b64);
    const out = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) out[i] = binary.charCodeAt(i);
    return out;
  }
  return Buffer.from(b64, 'base64');
}

async function hmacSha256Base64Url(message, secret) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message));
  return encodeBase64Url(new Uint8Array(sig));
}

export async function createSessionToken(username, secret = getSessionSecret()) {
  const payload = {
    user: username,
    exp: Date.now() + SESSION_TTL_MS,
  };
  const data = encodeBase64Url(JSON.stringify(payload));
  const signature = await hmacSha256Base64Url(data, secret);
  return `${data}.${signature}`;
}

export async function verifySessionToken(token, secret = getSessionSecret()) {
  if (!token) return null;

  const separator = token.lastIndexOf('.');
  if (separator === -1) return null;

  const data = token.slice(0, separator);
  const signature = token.slice(separator + 1);
  const expected = await hmacSha256Base64Url(data, secret);
  if (signature !== expected) return null;

  try {
    const json = new TextDecoder().decode(decodeBase64Url(data));
    const payload = JSON.parse(json);
    if (!payload?.user || !payload?.exp || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function getDocApiAccessFromCookies(cookieHeader, secret = getSessionSecret()) {
  if (!docApiProtectEnabled()) {
    return { ok: true, user: null, mode: 'open' };
  }

  const cookies = parseCookieHeader(cookieHeader);
  const docSession = await verifySessionToken(cookies[DOC_SESSION_COOKIE], secret);
  if (docSession) {
    return { ok: true, user: docSession.user, mode: 'doc' };
  }

  const adminSession = await verifySessionToken(cookies[ADMIN_SESSION_COOKIE], secret);
  if (adminSession) {
    return { ok: true, user: adminSession.user, mode: 'admin' };
  }

  return { ok: false };
}

export function buildSessionCookie(name, token, maxAgeSec) {
  const secure = process.env.VERCEL === '1' ? '; Secure' : '';
  return `${name}=${encodeURIComponent(token)}; HttpOnly; Path=/; Max-Age=${maxAgeSec}; SameSite=Lax${secure}`;
}

export function buildClearCookie(name) {
  const secure = process.env.VERCEL === '1' ? '; Secure' : '';
  return `${name}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax${secure}`;
}
