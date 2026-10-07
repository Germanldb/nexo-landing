import type { ReferenceChapter, ReferenceSection } from '../components/doc/ApiReferenceChapter.astro';
import { formatPublicDocHeadingTitle } from './api-doc-display-titles';
import {
  filterPublicEndpointList,
  isExcludedApiDocChapter,
  sanitizePublicIntroBlock,
} from './api-doc-public-scope';

export const V2_TAIL_CHAPTER_IDS = new Set([
  'ref-10-catalogo-rapido-de-rutas',
  'ref-11-errores-frecuentes-y-checklist-de-integracion',
]);

function isV2ModulesChapter(chapter: ReferenceChapter) {
  return chapter.title.includes('Módulos NEXO') || chapter.id.includes('ref-7');
}

function chapterForPublic(chapter: ReferenceChapter): ReferenceChapter {
  return {
    ...chapter,
    intro: chapter.intro.map((block) => sanitizePublicIntroBlock(block)).filter(Boolean),
    endpoints: filterPublicEndpointList(chapter.endpoints),
    sections: chapter.sections.map((section) => ({
      ...section,
      intro: section.intro.map((block) => sanitizePublicIntroBlock(block)).filter(Boolean),
      endpoints: filterPublicEndpointList(section.endpoints),
    })),
  };
}

function catalogAsSection(chapter: ReferenceChapter): ReferenceSection {
  return {
    id: chapter.id,
    title: formatPublicDocHeadingTitle(chapter.title),
    intro: chapter.intro.map((block) => sanitizePublicIntroBlock(block)).filter(Boolean),
    endpoints: filterPublicEndpointList(chapter.endpoints),
  };
}

function errorsAsSections(chapter: ReferenceChapter): ReferenceSection[] {
  const head: ReferenceSection = {
    id: chapter.id,
    title: formatPublicDocHeadingTitle(chapter.title),
    intro: chapter.intro.map((block) => sanitizePublicIntroBlock(block)).filter(Boolean),
    endpoints: filterPublicEndpointList(chapter.endpoints),
  };
  const subs = chapter.sections.map((section) => ({
    ...section,
    title: formatPublicDocHeadingTitle(section.title),
    intro: section.intro.map((block) => sanitizePublicIntroBlock(block)).filter(Boolean),
    endpoints: filterPublicEndpointList(section.endpoints),
  }));
  return [head, ...subs];
}

export function mergeV2TailIntoModules(
  modules: ReferenceChapter,
  catalog?: ReferenceChapter | null,
  errors?: ReferenceChapter | null,
): ReferenceChapter {
  const tail: ReferenceSection[] = [];
  if (catalog) tail.push(catalogAsSection(catalog));
  if (errors) tail.push(...errorsAsSections(errors));
  return {
    ...modules,
    sections: [...modules.sections, ...tail],
  };
}

/** Capítulos visibles: 8–9 PDF ocultos; catálogo y errores van como §8 y §9 dentro del cap. 7. */
export function buildPublicReferenceChapters(raw: ReferenceChapter[]): ReferenceChapter[] {
  const filtered = raw
    .filter((c) => !c.id.includes('ref-1-como-usar'))
    .filter((c) => !isExcludedApiDocChapter(c));

  const catalog = filtered.find((c) => c.id === 'ref-10-catalogo-rapido-de-rutas');
  const errors = filtered.find((c) => c.id === 'ref-11-errores-frecuentes-y-checklist-de-integracion');

  return filtered
    .filter((c) => !V2_TAIL_CHAPTER_IDS.has(c.id))
    .map((chapter) => {
      const pub = chapterForPublic(chapter);
      if (!isV2ModulesChapter(chapter)) return pub;
      return mergeV2TailIntoModules(
        pub,
        catalog ? chapterForPublic(catalog) : null,
        errors ? chapterForPublic(errors) : null,
      );
    });
}
