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
  const counts = new Map<string, number>();

  return titles.map((title) => {
    const base = slugifySectionTitle(title);
    const count = counts.get(base) ?? 0;
    counts.set(base, count + 1);
    return count === 0 ? base : `${base}-${count + 1}`;
  });
}
