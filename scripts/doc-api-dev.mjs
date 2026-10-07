/**
 * API mínima para login de /doc en local (pnpm run dev).
 * En Vercel usan las funciones en api/doc/*.js
 */
import { createServer } from 'node:http';
import { config } from 'dotenv';
import loginHandler from '../api/doc/login.js';
import sessionHandler from '../api/doc/session.js';
import logoutHandler from '../api/doc/logout.js';
import { listDocApiAccounts } from '../lib/doc-session.js';

config();

const port = Number(process.env.DOC_API_DEV_PORT ?? 3099);

const routes = new Map([
  ['POST:/doc/login', loginHandler],
  ['GET:/doc/session', sessionHandler],
  ['POST:/doc/logout', logoutHandler],
]);

const server = createServer(async (req, res) => {
  const pathname = new URL(req.url ?? '/', `http://127.0.0.1:${port}`).pathname;
  const key = `${req.method}:${pathname}`;
  const handler = routes.get(key);

  if (!handler) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ ok: false, message: 'Ruta no encontrada (doc-api-dev)' }));
    return;
  }

  try {
    await handler(req, res);
  } catch (error) {
    console.error('[doc-api-dev]', error);
    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ ok: false, message: 'Error interno doc-api-dev' }));
    }
  }
});

server.listen(port, () => {
  const accounts = listDocApiAccounts().length;
  console.log(
    `[doc-api-dev] http://127.0.0.1:${port} — protección ${process.env.DOC_API_PASSWORD ? 'ON' : 'OFF'}${accounts ? ` (${accounts} usuario(s) doc)` : ''}`,
  );
});
