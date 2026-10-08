export type IntroSegment =
  | { type: 'prose'; lines: string[] }
  | { type: 'table'; headers: string[]; rows: string[][] }
  | { type: 'curl'; code: string }
  | { type: 'list'; title?: string; items: string[] }
  | { type: 'heading'; text: string };

const TABLE_HEADERS: { pattern: RegExp; headers: string[] }[] = [
  { pattern: /^HTTP\s+Mensaje/i, headers: ['HTTP', 'Mensaje típico', 'Causa'] },
  { pattern: /^Familia\s+Éxito/i, headers: ['Familia', 'Éxito', 'Error'] },
  { pattern: /^Código\s+Significado/i, headers: ['Código', 'Significado en este servidor'] },
  { pattern: /^Campo\s+(JSON|Dónde)/i, headers: ['Campo', 'JSON', 'Uso'] },
  { pattern: /^Campo\s+Tipo/i, headers: ['Campo', 'Tipo', 'Req.', 'Descripción'] },
  { pattern: /^Campo\s+Req\.\s+Descripción/i, headers: ['Campo', 'Req.', 'Descripción'] },
  { pattern: /^Campo\s+Descripción/i, headers: ['Campo', 'Descripción'] },
  { pattern: /^Método\s+Ruta/i, headers: ['Método', 'Ruta', 'Acción'] },
  { pattern: /^Ruta\s+Función/i, headers: ['Ruta', 'Función'] },
  { pattern: /^Ruta\s+Equivalente/i, headers: ['Ruta', 'Equivalente Facilito'] },
  { pattern: /^accion\s+Qué\s+hace/i, headers: ['accion', 'Qué hace', 'Campos'] },
  { pattern: /^Módulo\s+Lectura/i, headers: ['Módulo', 'Lectura', 'Escritura'] },
  { pattern: /^Comando\s+Propósito/i, headers: ['Comando', 'Propósito', 'Params clave'] },
];

function isTableHeaderLine(line: string) {
  return TABLE_HEADERS.some((t) => t.pattern.test(line.trim()));
}

function headersForLine(line: string) {
  return TABLE_HEADERS.find((t) => t.pattern.test(line.trim()))?.headers ?? ['Col 1', 'Col 2'];
}

const ROUTE_METHOD =
  /^(GET(?:\/(?:GET|POST|PUT|DELETE|PUT\/POST))+|GET\/POST|GET\/PUT\/POST|POST|PUT|DELETE|GET)\s+/;

function parseRutaFuncionRow(line: string): string[] | null {
  const t = line.trim();
  const methodMatch = t.match(ROUTE_METHOD);
  if (!methodMatch) return null;
  const rest = t.slice(methodMatch[0].length);
  const pathMatch = rest.match(/^((?:\/[^\s]+(?:\s·\s(?:\/|\?|\{)[^\s]+)*))\s+(.+)$/);
  if (!pathMatch) return null;
  const ruta = `${methodMatch[0].trim()} ${pathMatch[1]}`.replace(/\s+/g, ' ');
  return [ruta, pathMatch[2].trim()];
}

function parseAccionC2pRow(line: string): string[] | null {
  const t = line.trim();
  if (/^accion\s/i.test(t)) return null;
  const m = t.match(/^(\([^)]+\)|\S+)\s+(.+?)\s+([a-z_][\w,=\s|]+)$/i);
  if (m) return [m[1], m[2], m[3]];
  const m2 = t.match(/^(\([^)]+\)|\S+)\s+(.+)$/);
  if (m2) return [m2[1], m2[2], ''];
  return null;
}

function parseFamiliaResponseRow(line: string): string[] | null {
  const t = line.trim();
  const firstJson = t.indexOf('{');
  if (firstJson <= 0) return null;
  const family = t.slice(0, firstJson).trim();
  const jsonPart = t.slice(firstJson);
  const split = jsonPart.match(/^(\{.+?\})\s+(\{.+?\})$/);
  if (split) return [family, split[1], split[2]];
  return null;
}

function normalizeIntroLines(block: string) {
  const labelStart =
    /^(Content-Type|Codificación|Fechas|Montos|CORS|Chatbot|Formatos de respuesta|Códigos HTTP|HTTP\s|Método|Familia|Código|Campo|Comando\s+Propósito|Ruta|Módulo)\b/i;
  const out: string[] = [];
  for (const raw of block.split('\n')) {
    const t = raw.trim();
    if (!t) continue;
    if (labelStart.test(t) || isTableHeaderLine(t) || t.startsWith('curl ') || ROUTE_METHOD.test(t)) {
      out.push(t);
      continue;
    }
    if (out.length > 0 && isTableHeaderLine(out[out.length - 1] ?? '')) {
      out.push(t);
      continue;
    }
    if (out.length > 0 && ROUTE_METHOD.test(out[out.length - 1] ?? '')) {
      out.push(t);
      continue;
    }
    if (/^\d{3}\s/.test(t)) {
      out.push(t);
      continue;
    }
    if (/^SmartOlt/i.test(t)) {
      out.push(t);
      continue;
    }
    if (
      out.length > 0 &&
      /^SmartOlt/i.test(out[out.length - 1] ?? '') &&
      !labelStart.test(t) &&
      !isTableHeaderLine(t)
    ) {
      out[out.length - 1] += ` ${t}`;
      continue;
    }
    if (
      out.length > 0 &&
      (t.startsWith('{') ||
        t.startsWith('API ') ||
        t.startsWith('Muchos ') ||
        t.startsWith('Pagos ') ||
        t.startsWith('/api/'))
    ) {
      out.push(t);
      continue;
    }
    if (out.length > 0) {
      out[out.length - 1] += ` ${t}`;
    } else {
      out.push(t);
    }
  }
  return out.join('\n');
}

function parseTableRow(line: string, colCount: number, headers: string[]): string[] | null {
  const t = line.trim();
  if (!t || t.startsWith('#') || t.startsWith('curl ')) return null;
  if (isTableHeaderLine(t)) return null;
  if (/^Formatos de respuesta|^Códigos HTTP|^Chatbot:|^CORS:/i.test(t)) return null;

  if (colCount === 3 && headers[0] === 'Familia' && t.includes('{')) {
    return parseFamiliaResponseRow(t);
  }

  if (colCount === 3 && headers[0] === 'Comando' && /^SmartOlt/i.test(t)) {
    const m = t.match(/^(SmartOlt\w+)\s+(.+?)\s+(token.*)$/i);
    if (m) return [m[1], m[2], m[3]];
    const parts = t.match(/^(SmartOlt\w+)\s+(.+)$/);
    if (parts) return [parts[1], parts[2], 'token'];
  }

  if (colCount === 2) {
    if (headers[0] === 'Ruta' && headers[1] === 'Función') {
      return parseRutaFuncionRow(t);
    }
    const m = t.match(/^(\d{3})\s+(.+)$/);
    if (m) return [m[1], m[2]];
    const m2 = t.match(/^(\S+)\s+(.+)$/);
    if (m2) return [m2[1], m2[2]];
  }
  if (colCount === 3 && headers[0] === 'accion') {
    return parseAccionC2pRow(t);
  }
  if (colCount === 3) {
    const http = t.match(/^(\d{3})\s+(.+)$/);
    if (http) {
      const rest = http[2];
      const dotted = rest.match(/^(.+?)\.\s+([A-ZÁÉÍÓÚÑ].*)$/u);
      if (dotted) return [http[1], `${dotted[1]}.`, dotted[2]];
      const parts = rest.split(/\s{2,}|\t/);
      if (parts.length >= 2) return [http[1], parts[0], parts.slice(1).join(' ')];
      return [http[1], rest, ''];
    }
    const parts = t.split(/\s{2,}|\t/);
    if (parts.length >= 3) return parts.slice(0, 3);
    const m2 = t.match(/^(\S+)\s+(.+?)\s+(.+)$/);
    if (m2) return [m2[1], m2[2], m2[3]];
  }
  if (colCount === 4) {
    const m = t.match(/^(\S+)\s+(\S+)\s+(Sí\*?|No\*?|Cond\.)\s+(.+)$/);
    if (m) return [m[1], m[2], m[3], m[4]];
  }
  return null;
}

function splitListItems(text: string): string[] {
  return text
    .split(/\n/)
    .map((l) => l.trim())
    .filter(Boolean);
}

export function splitIntroBlock(block: string): IntroSegment[] {
  const lines = normalizeIntroLines(block).split('\n');
  const segments: IntroSegment[] = [];
  let i = 0;
  let proseBuf: string[] = [];

  const flushProse = () => {
    if (proseBuf.length === 0) return;
    const joined = proseBuf.join('\n').trim();
    if (!joined) {
      proseBuf = [];
      return;
    }

    const conventionItems: string[] = [];
    const other: string[] = [];
    for (const line of proseBuf) {
      const t = line.trim();
      if (/^(CORS|Chatbot|Content-Type|Codificación|Fechas|Montos):/i.test(t)) {
        conventionItems.push(t);
      } else if (t === 'Formatos de respuesta' || t === 'Códigos HTTP') {
        other.push(t);
      } else {
        other.push(line);
      }
    }
    if (conventionItems.length) {
      segments.push({
        type: 'list',
        title: 'Convenciones',
        items: conventionItems,
      });
    }
    for (const line of other) {
      const t = line.trim();
      if (t === 'Formatos de respuesta' || t === 'Códigos HTTP') {
        segments.push({ type: 'heading', text: t });
      } else if (t) {
        segments.push({ type: 'prose', lines: [line] });
      }
    }
    proseBuf = [];
  };

  while (i < lines.length) {
    const raw = lines[i];
    const line = raw.trim();

    if (line.startsWith('{') && line.includes('"')) {
      flushProse();
      segments.push({ type: 'curl', code: line });
      i += 1;
      continue;
    }

    if (line.startsWith('curl ')) {
      flushProse();
      let code = line;
      i += 1;
      while (i < lines.length) {
        const next = lines[i];
        if (
          !next.trim() ||
          next.trim().startsWith('curl ') ||
          isTableHeaderLine(next) ||
          next.trim().startsWith('#### ') ||
          next.trim().startsWith('### ') ||
          next.trim().startsWith('## ')
        ) {
          break;
        }
        if (next.startsWith('-') || next.startsWith("'") || next.startsWith('"') || next.startsWith('{')) {
          code += `\n${next}`;
          i += 1;
          if (next.trim().startsWith('{')) break;
          continue;
        }
        break;
      }
      segments.push({ type: 'curl', code: code.trim() });
      continue;
    }

    if (isTableHeaderLine(line)) {
      flushProse();
      const headers = headersForLine(line);
      const rows: string[][] = [];
      i += 1;
      while (i < lines.length) {
        const rowLine = lines[i].trim();
        if (!rowLine) {
          i += 1;
          if (rows.length > 0) break;
          continue;
        }
        if (
          isTableHeaderLine(rowLine) ||
          rowLine.startsWith('curl ') ||
          rowLine.startsWith('#### ') ||
          rowLine.startsWith('Formatos de respuesta') ||
          rowLine.startsWith('Códigos HTTP')
        ) {
          break;
        }
        const row = parseTableRow(rowLine, headers.length, headers);
        if (row) {
          rows.push(row);
          i += 1;
        } else if (rows.length > 0) {
          break;
        } else {
          break;
        }
      }
      if (rows.length) segments.push({ type: 'table', headers, rows });
      continue;
    }

    if (line === 'Formatos de respuesta' || line === 'Códigos HTTP') {
      flushProse();
      segments.push({ type: 'heading', text: line });
      i += 1;
      continue;
    }

    if (line) proseBuf.push(raw);
    i += 1;
  }

  flushProse();
  return segments.length ? segments : [{ type: 'prose', lines: block.split('\n').filter((l) => l.trim()) }];
}
