import referenceData from '../data/nexo-api-reference.json';
import type { DocNavGroup, DocNavItem } from '../components/doc/doc-nav-types';
import { filterPublicEndpointList } from './api-doc-public-scope';
import { formatPublicDocHeadingTitle } from './api-doc-display-titles';
import { buildPublicReferenceChapters } from './api-doc-public-chapters';

type Chapter = (typeof referenceData.chapters)[number];
type Section = Chapter['sections'][number];
type Endpoint = Section['endpoints'][number];

function stripNumberPrefix(title: string) {
  return title.replace(/^\d+(\.\d+)?\s*/, '').trim();
}

function navLabel(title: string, path: string) {
  const cmd = path.split('/').pop()?.split(' ')[0] ?? '';
  if (cmd && /^[A-Z]/.test(cmd)) {
    return cmd.replace(/([A-Z])/g, ' $1').trim();
  }
  if (title?.trim()) {
    const t = title.trim();
    return t.charAt(0).toUpperCase() + t.slice(1);
  }
  return path;
}

function endpointItems(endpoints: Endpoint[]): DocNavItem[] {
  return filterPublicEndpointList(endpoints)
    .filter((ep) => ep.method !== 'INFO')
    .filter((ep) => ep.title !== '{' && ep.title !== '}')
    .filter((ep) => !/^\?\w+=/.test(ep.path))
    .map((ep) => ({
      title: navLabel(ep.title, ep.path),
      id: ep.id,
      method: ep.method !== 'INFO' ? ep.method : undefined,
    }));
}

function sectionNavTitle(section: Section, keepNumber = false) {
  const titled = formatPublicDocHeadingTitle(section.title);
  return keepNumber ? titled : stripNumberPrefix(titled);
}

function sectionAsSubgroup(section: Section, keepNumber = false): DocNavItem | null {
  const title = sectionNavTitle(section, keepNumber);
  if (/smartolt/i.test(section.title) && section.endpoints.length === 0) {
    return { title, id: section.id };
  }
  const endpoints = endpointItems(section.endpoints);
  const hasIntro = section.intro.length > 0;
  if (endpoints.length === 0) {
    if (keepNumber && (hasIntro || /^8\.|^9(\.|$)/.test(title))) {
      return { title, id: section.id };
    }
    return null;
  }
  return {
    title,
    id: section.id,
    children: endpoints,
    defaultOpen: /facturaci|7\.2/i.test(title),
  };
}

function findChapter(match: (c: Chapter) => boolean) {
  return referenceData.chapters.find(match);
}

export function buildApiDocNavGroups(): DocNavGroup[] {
  const groups: DocNavGroup[] = [];

  groups.push({
    label: 'NEXO API',
    defaultOpen: true,
    items: [
      { title: 'Introducción', id: 'api-readme-intro' },
      { title: 'Autenticación', id: 'ref-3-autenticacion' },
      { title: 'Convenciones HTTP', id: 'ref-4-convenciones-cors-y-codigos-http' },
    ],
  });

  const ch5 = findChapter((c) => c.title.includes('API v1'));
  if (ch5) {
    const subgroups = ch5.sections.map(sectionAsSubgroup).filter(Boolean) as DocNavItem[];
    groups.push({
      label: 'API v1',
      defaultOpen: true,
      items: [
        { title: 'Resumen v1 / v11', id: ch5.id },
        ...subgroups,
      ],
    });
  }

  const ch6 = findChapter((c) => c.title.includes('v11'));
  if (ch6) {
    groups.push({
      label: 'API v11',
      items: [{ title: 'Proxy Bearer → v1', id: ch6.id }],
    });
  }

  const merged = buildPublicReferenceChapters(referenceData.chapters as Chapter[]);
  const ch7 = merged.find((c) => c.title.includes('Módulos NEXO'));

  if (ch7) {
    const subgroups = ch7.sections
      .map((section) => sectionAsSubgroup(section, true))
      .filter(Boolean) as DocNavItem[];
    groups.push({
      label: 'API v2 / v21',
      defaultOpen: true,
      items: [{ title: 'Resumen módulos NEXO', id: ch7.id }, ...subgroups],
    });
  }

  return groups;
}
