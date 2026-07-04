export function slugifySectionTitle(title: string): string {
  const slug = title
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "section";
}

export function uniqueSectionAnchors(titles: string[]): string[] {
  return uniqueAnchors(titles, "section");
}

export function uniqueAnchors(labels: string[], fallbackBase: string): string[] {
  const counts = new Map<string, number>();

  return labels.map((label) => {
    const base = slugifySectionTitle(label) || slugifySectionTitle(fallbackBase);
    const count = counts.get(base) ?? 0;
    counts.set(base, count + 1);
    return count === 0 ? base : `${base}-${count + 1}`;
  });
}
