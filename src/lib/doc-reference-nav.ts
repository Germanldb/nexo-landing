import referenceMd from '../data/nexo-api-reference.md?raw';

export function slugifyReferenceTitle(title: string) {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export const referenceNavItems = [...referenceMd.matchAll(/^## (\d+\.\s*.+)$/gm)].map((m) => {
  const full = m[1].trim();
  const title = full.replace(/^\d+\.\s*/, '');
  return { title, id: `ref-${slugifyReferenceTitle(full)}` };
});
