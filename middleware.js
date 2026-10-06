import {
  docApiProtectEnabled,
  getDocApiAccessFromCookies,
  getSessionSecret,
} from './lib/doc-session.js';

export const config = {
  matcher: ['/doc/api', '/doc/api/:path*'],
};

export default async function middleware(request) {
  if (!docApiProtectEnabled()) {
    return;
  }

  const access = await getDocApiAccessFromCookies(
    request.headers.get('cookie') ?? '',
    getSessionSecret(),
  );

  if (access.ok) {
    return;
  }

  const url = new URL('/doc/acceso', request.url);
  url.searchParams.set('next', new URL(request.url).pathname);
  return Response.redirect(url, 307);
}
