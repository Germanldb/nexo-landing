/** Parsea filas tipo PDF: Campo Tipo Req. Descripción */
export function parseParamLineTyped(line: string) {
  const t = line.trim();
  if (!t || t.startsWith('*')) return { footnote: t.startsWith('*') ? t : null, param: null };

  const reqMatch = t.match(/\s+(Sí\*?|No\*?|Cond\.|Req\.)\s+(.+)$/);
  if (!reqMatch) return { footnote: null, param: null };

  const required = reqMatch[1];
  const description = reqMatch[2];
  const before = t.slice(0, reqMatch.index).trim();

  const typeMatch = before.match(
    /\s+(string\[\]|number\[\]|string|number|boolean|bool|array|object)\s*$/i,
  );
  if (!typeMatch) return { footnote: null, param: null };

  const type = typeMatch[1];
  const name = before.slice(0, typeMatch.index).trim();

  return {
    footnote: null,
    param: {
      name,
      type,
      required,
      description,
    },
  };
}

/** Filas sin Tipo: Campo Req. / Campo Req. Notas */
export function parseParamLineSimple(line: string) {
  const t = line.trim();
  if (!t || t.startsWith('*')) return null;
  if (/^\d{3}\b/.test(t) || /\.\s*\d{3}\b/.test(t)) return null;
  const m = t.match(/^(.+?)\s+(Sí\*+(?:\s+en\s+[\wáéíóú]+)?|No\*+|Cond\.)(\s+.*)?$/);
  if (!m) return null;
  return {
    name: m[1].trim(),
    type: '—',
    required: m[2],
    description: (m[3] ?? '').trim(),
  };
}

export function parseParamLine(line: string) {
  const typed = parseParamLineTyped(line);
  if (typed.footnote || typed.param) return typed;
  const simple = parseParamLineSimple(line);
  if (simple) return { footnote: null, param: simple };
  return { footnote: null, param: null };
}

export function isParamTableHeader(header: string) {
  if (!header.includes('Campo')) return false;
  return header.includes('Tipo') || header.includes('JSON') || /Req/i.test(header);
}
