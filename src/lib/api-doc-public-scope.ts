/** Contenido bancario (webhooks / recaudadores) no publicado en la doc web para integradores. */

export function isExcludedApiDocChapter(chapter: { id: string; title?: string }) {
  if (/ref-8-webhook|ref-9-recaudador/i.test(chapter.id)) return true;
  if (chapter.title && /webhook|recaudador|pasarelas bancarias/i.test(chapter.title)) {
    return true;
  }
  return false;
}

export function isBankSensitiveEndpoint(endpoint: { path?: string; id?: string }) {
  const haystack = `${endpoint.path ?? ''} ${endpoint.id ?? ''}`.toLowerCase();
  return (
    /webhook|serdimpre|facilito|puntoagil|evertec\/|bancoestado|\/recaudador/.test(haystack) ||
    haystack.includes('placetopay')
  );
}

export function filterPublicEndpointList<T extends { path?: string; id?: string }>(endpoints: T[]) {
  return endpoints.filter((ep) => !isBankSensitiveEndpoint(ep));
}

export function sanitizePublicDiagram(text: string) {
  return text
    .split('\n')
    .filter((line) => !/webhook|facilito|puntoagil|evertec|recaudador/i.test(line))
    .join('\n')
    .trim();
}

export function sanitizePublicIntroBlock(text: string) {
  const lines = text.split('\n').filter((line) => {
    const t = line.trim();
    if (!t) return true;
    if (/^Webhooks\s/i.test(t) || /^Recaudadores\s/i.test(t)) return false;
    if (/webhooks que llaman bancos|recaudadores \(Facilito/i.test(t)) return false;
    return true;
  });
  return lines.join('\n').trim();
}
