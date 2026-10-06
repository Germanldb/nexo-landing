import {
  docApiProtectEnabled,
  getDocApiAccessFromCookies,
  getSessionSecret,
} from '../../lib/doc-session.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.statusCode = 405;
    res.end('Method Not Allowed');
    return;
  }

  const access = await getDocApiAccessFromCookies(req.headers.cookie ?? '', getSessionSecret());

  if (!access.ok) {
    res.statusCode = 401;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ ok: false, protected: docApiProtectEnabled() }));
    return;
  }

  res.setHeader('Content-Type', 'application/json');
  res.end(
    JSON.stringify({
      ok: true,
      user: access.user,
      mode: access.mode,
      protected: docApiProtectEnabled(),
    }),
  );
}
