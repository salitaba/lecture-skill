export interface FactsListItem {
  label: string;
  value: string;
}

export interface FactsListProps {
  items: FactsListItem[];
  variant?: "default" | "compact";
  "aria-label": string;
  className?: string;
}

export function FactsList({ items, variant = "default", "aria-label": ariaLabel, className }: FactsListProps) {
  const visibleItems = items.filter((item) => item.label.trim() !== "" && item.value.trim() !== "");
  if (visibleItems.length === 0) return null;

  return (
    <dl className={["facts-list", `facts-list-${variant}`, className].filter(Boolean).join(" ")} aria-label={ariaLabel}>
      {visibleItems.map((item) => (
        <div className="facts-list-item" key={`${item.label}-${item.value}`}>
          <dt>{item.label}</dt>
          <dd>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
