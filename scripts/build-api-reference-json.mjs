/**
 * Convierte el markdown de referencia (derivado del PDF) en JSON estructurado
 * para renderizado con tarjetas en la doc web.
 */
import fs from 'fs';

const mdPath = 'src/data/nexo-api-reference.md';
const outPath = 'src/data/nexo-api-reference.json';

const md = fs.readFileSync(mdPath, 'utf8');

function slugify(title) {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function refId(title) {
  return `ref-${slugify(title)}`;
}

function lastEndpoint(chapter, section) {
  if (section?.endpoints.length) return section.endpoints[section.endpoints.length - 1];
  if (chapter?.endpoints.length) return chapter.endpoints[chapter.endpoints.length - 1];
  return null;
}

/** GET con query de ejemplo (p. ej. ?cedula=V12345678), no es un endpoint distinto en el PDF */
function isExampleGetLine(method, path) {
  if (method !== 'GET') return false;
  if (path.includes(' · ')) return false;
  return /\?[a-z_]+=[^/\s·]+/i.test(path);
}

/** p. ej. "GET /api/v2/facturacion responde texto plano working." — nota del PDF, no otro endpoint */
function isGetProseNote(method, path) {
  if (method !== 'GET') return false;
  const m = path.match(/^(\/api\/[^\s·]+)\s+(.+)$/);
  if (!m) return false;
  const rest = m[2];
  if (rest.startsWith('·') || rest.startsWith('/')) return false;
  return /^(responde|devuelve|retorna)\b/i.test(rest);
}

function isBadTitleLine(line) {
  const t = line.trim();
  return !t || t === '{' || t === '}' || t.startsWith('[') || t.startsWith('"');
}

function isParamTableHeader(header) {
  if (!header.includes('Campo')) return false;
  return (
    header.includes('Tipo') ||
    header.includes('JSON') ||
    /Req/i.test(header)
  );
}

function parseParamLineTyped(line) {
  const t = line.trim();
  if (!t) return { footnote: null, param: null };
  if (t.startsWith('*')) return { footnote: t, param: null };

  const reqMatch = t.match(/\s+(Sí\*?|No\*?|Cond\.|Req\.)\s+(.+)$/);
  if (!reqMatch) return { footnote: null, param: null };

  const required = reqMatch[1];
  const description = reqMatch[2];
  const before = t.slice(0, reqMatch.index).trim();
  const typeMatch = before.match(
    /\s+(string\[\]|number\[\]|string|number|boolean|bool|array|object)\s*$/i,
  );
  if (!typeMatch) return { footnote: null, param: null };

  return {
    footnote: null,
    param: {
      name: before.slice(0, typeMatch.index).trim(),
      type: typeMatch[1],
      required,
      description,
    },
  };
}

/** Filas sin columna Tipo: "Campo Req.", "Campo Req. Notas", etc. */
function parseParamLineSimple(line) {
  const t = line.trim();
  if (!t || t.startsWith('*')) return null;
  if (/^\d{3}\b/.test(t) || /\.\s*\d{3}\b/.test(t)) return null;
  const m = t.match(/^(.+?)\s+(Sí\*?(?:\s+en\s+[\wáéíóú]+)?|No\*?|Cond\.)(\s+.*)?$/);
  if (!m) return null;
  const description = (m[3] ?? '').trim();
  return {
    name: m[1].trim(),
    type: '—',
    required: m[2],
    description,
  };
}

function parseParamLine(line) {
  const typed = parseParamLineTyped(line);
  if (typed.param || typed.footnote) return typed;
  const simple = parseParamLineSimple(line);
  if (simple) return { footnote: null, param: simple };
  return { footnote: null, param: null };
}

function parseParams(lines, startIdx) {
  const params = [];
  const notes = [];
  let i = startIdx;
  const header = lines[i]?.trim() ?? '';
  if (!isParamTableHeader(header)) {
    return { params, notes, nextIndex: startIdx };
  }
  i += 1;
  while (i < lines.length) {
    const line = lines[i].trim();
    if (!line) {
      i += 1;
      continue;
    }
    if (
      line.startsWith('#### ') ||
      line.startsWith('### ') ||
      line.startsWith('## ') ||
      line.startsWith('{') ||
      line.startsWith('curl ') ||
      /^WEBHOOK|^SOAP|^\* \/api|^Método |^Comandos v1|^Módulos v2|^Auth y|^Ruta |^Flujo |^Cliente /.test(line)
    ) {
      break;
    }
    if (isParamTableHeader(line)) {
      break;
    }
    const parsed = parseParamLine(line);
    if (parsed.footnote) {
      notes.push(parsed.footnote);
      i += 1;
      continue;
    }
    if (parsed.param) {
      params.push(parsed.param);
      i += 1;
      continue;
    }
    if (params.length > 0) break;
    break;
  }
  return { params, notes, nextIndex: i };
}

function isHeadingLine(line) {
  return (
    line.startsWith('#### ') ||
    line.startsWith('### ') ||
    line.startsWith('## ')
  );
}

function jsonBlobComplete(blob) {
  const t = blob.trim();
  return t.endsWith('}') || t.endsWith('}]') || t.endsWith(']');
}

function collectJsonExamples(lines, startIdx) {
  const examples = [];
  let i = startIdx;
  while (i < lines.length) {
    const line = lines[i].trim();
    if (isHeadingLine(line)) break;
    if (line.startsWith('{') || line.startsWith('[')) {
      let blob = line;
      i += 1;
      while (i < lines.length && !jsonBlobComplete(blob)) {
        const next = lines[i].trim();
        if (isHeadingLine(next)) break;
        blob += `\n${lines[i]}`;
        i += 1;
      }
      examples.push(blob.trim());
      continue;
    }
    if (line.startsWith('curl ')) {
      let blob = line;
      i += 1;
      while (i < lines.length && (lines[i].startsWith('-') || lines[i].startsWith("'") || lines[i].startsWith('"'))) {
        blob += `\n${lines[i]}`;
        i += 1;
      }
      examples.push(blob);
      continue;
    }
    if (!line) {
      i += 1;
      if (examples.length > 0) break;
      continue;
    }
    if (examples.length > 0) break;
    i += 1;
  }
  return { examples, nextIndex: i };
}

const chapters = [];
let currentChapter = null;
let currentSection = null;

const lines = md.split('\n');
let i = 0;

while (i < lines.length) {
  const line = lines[i];

  if (line.startsWith('## ')) {
    const title = line.slice(3).trim();
    if (title.startsWith('Referencia API')) {
      i += 1;
      continue;
    }
    currentChapter = {
      id: refId(title),
      title,
      intro: [],
      sections: [],
      endpoints: [],
      prose: [],
    };
    chapters.push(currentChapter);
    currentSection = null;
    i += 1;
    continue;
  }

  if (!currentChapter) {
    i += 1;
    continue;
  }

  if (line.startsWith('### ')) {
    currentSection = {
      id: refId(line.slice(4).trim()),
      title: line.slice(4).trim(),
      intro: [],
      endpoints: [],
    };
    currentChapter.sections.push(currentSection);
    i += 1;
    continue;
  }

  if (line.startsWith('#### ')) {
    const head = line.slice(5).trim();
    const methodMatch = head.match(
      /^(WEBHOOK GET\/POST|WEBHOOK POST|GET\/PUT\/POST|GET\/POST|GET|POST|PUT|DELETE|SOAP)\s+(.+)$/i,
    );
    const method = methodMatch ? methodMatch[1].toUpperCase().replace(/\s+/g, ' ') : 'INFO';
    const path = methodMatch ? methodMatch[2].trim() : head;

    if (methodMatch && isGetProseNote(method, path)) {
      const attach = lastEndpoint(currentChapter, currentSection);
      const noteMatch = path.match(/^(\/api\/[^\s·]+)\s+(.+)$/);
      i += 1;
      if (attach && noteMatch) {
        attach.description.push(`GET ${noteMatch[1]} — ${noteMatch[2]}`);
        const paramParse = parseParams(lines, i);
        if (paramParse.params.length > 0) {
          attach.params = paramParse.params;
          attach.notes = [...(attach.notes ?? []), ...paramParse.notes];
        }
        i = paramParse.nextIndex;
        const exParse = collectJsonExamples(lines, i);
        if (exParse.examples.length > 0) {
          attach.examples.push(...exParse.examples);
        }
        i = exParse.nextIndex;
      }
      continue;
    }

    if (methodMatch && isExampleGetLine(method, path)) {
      const attach = lastEndpoint(currentChapter, currentSection);
      i += 1;
      if (attach) {
        const exParse = collectJsonExamples(lines, i);
        const sample = exParse.examples.join('\n\n');
        attach.examples.push(
          sample ? `GET ${path}\n${sample}` : `GET ${path}`,
        );
        i = exParse.nextIndex;
        while (i < lines.length) {
          const l = lines[i].trim();
          if (!l || l.startsWith('#### ') || l.startsWith('### ') || l.startsWith('## ')) break;
          if (!l.startsWith('{') && !l.startsWith('"') && !l.startsWith('}')) {
            attach.description.push(l);
          }
          i += 1;
        }
      }
      continue;
    }

    const endpoint = {
      id: refId(head),
      method: methodMatch ? methodMatch[1].toUpperCase().replace(/\s+/g, ' ') : 'INFO',
      path: methodMatch ? methodMatch[2].trim() : head,
      title: '',
      description: [],
      params: [],
      notes: [],
      examples: [],
    };
    i += 1;
    if (i < lines.length && lines[i].trim() && !lines[i].startsWith('Campo')) {
      const candidate = lines[i].trim();
      if (!isBadTitleLine(candidate)) {
        endpoint.title = candidate;
        i += 1;
      }
    }
    while (i < lines.length) {
      const l = lines[i].trim();
      if (isParamTableHeader(l)) break;
      if (l.startsWith('#### ') || l.startsWith('### ') || l.startsWith('## ')) break;
      if (/^SmartOLT \(vía/i.test(l)) break;
      if (l.startsWith('{') || l.startsWith('curl ')) break;
      if (l) endpoint.description.push(l);
      i += 1;
    }
    const paramParse = parseParams(lines, i);
    endpoint.params = paramParse.params;
    endpoint.notes = paramParse.notes;
    i = paramParse.nextIndex;
    const exParse = collectJsonExamples(lines, i);
    endpoint.examples = exParse.examples;
    i = exParse.nextIndex;

    if (currentSection) currentSection.endpoints.push(endpoint);
    else currentChapter.endpoints.push(endpoint);
    continue;
  }

  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const block = [];
    while (i < lines.length) {
      const l = lines[i].trim();
      if (!l || l.startsWith('#') || l.startsWith('#### ')) break;
      if (l.startsWith('{')) {
        block.push(l);
        i += 1;
        continue;
      }
      if (l.startsWith('curl ')) {
        block.push(l);
        i += 1;
        while (
          i < lines.length &&
          (lines[i].startsWith('-') ||
            lines[i].trim().startsWith("'") ||
            lines[i].trim().startsWith('"'))
        ) {
          block.push(lines[i].trim());
          i += 1;
        }
        continue;
      }
      block.push(l);
      i += 1;
    }
    if (block.length === 0) {
      i += 1;
      continue;
    }
    const text = block.join('\n');
    if (text) {
      if (currentSection) currentSection.intro.push(text);
      else currentChapter.intro.push(text);
    }
    continue;
  }

  i += 1;
}

const payload = {
  generatedFrom: mdPath,
  chapters,
};

fs.writeFileSync(outPath, JSON.stringify(payload, null, 2), 'utf8');
const endpointCount = chapters.reduce(
  (n, c) =>
    n +
    c.endpoints.length +
    c.sections.reduce((s, sec) => s + sec.endpoints.length, 0),
  0,
);
for (const ch of chapters) {
  const all = [
    ...ch.endpoints,
    ...ch.sections.flatMap((s) => s.endpoints),
  ];
  for (const ep of all) {
    const leaked = ep.description.filter((l) => /^Campo(\s|$)/i.test(l.trim()));
    if (leaked.length > 0) {
      console.warn(`[api-ref] Tabla no parseada en ${ep.id}: ${leaked[0]}`);
    }
  }
}
console.log(`Wrote ${outPath} — ${chapters.length} capítulos, ${endpointCount} fichas endpoint`);
