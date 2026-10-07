/** En la web pública no van los cap. 8–9 del PDF (webhooks/recaudadores); 10→8 y 11→9. */
const PUBLIC_TOP_LEVEL_RENUMBER: Record<number, number> = {
  10: 8,
  11: 9,
};

function renumberTopLevel(top: number) {
  return PUBLIC_TOP_LEVEL_RENUMBER[top] ?? top;
}

export function formatPublicDocHeadingTitle(title: string): string {
  const sub = title.match(/^(\d+)\.(\d+)\s+(.+)$/);
  if (sub) {
    const top = renumberTopLevel(parseInt(sub[1], 10));
    return `${top}.${sub[2]} ${sub[3]}`;
  }

  const topLevel = title.match(/^(\d+)\.\s+(.+)$/);
  if (topLevel) {
    const top = renumberTopLevel(parseInt(topLevel[1], 10));
    return `${top}. ${topLevel[2]}`;
  }

  return title;
}
