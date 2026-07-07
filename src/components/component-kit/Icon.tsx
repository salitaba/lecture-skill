export type IconName =
  | "chevron"
  | "check"
  | "warning"
  | "arrow-prev"
  | "arrow-next"
  | "sun"
  | "moon"
  | "expand"
  | "download"
  | "note";

const paths: Record<IconName, string> = {
  chevron: "M6 4l6 6-6 6",
  check: "M4 10.5l4 4L16 6",
  warning: "M10 3.5l8 14H2l8-14zM10 8.5v4M10 15h.01",
  "arrow-prev": "M12 4l-6 6 6 6M6 10h12",
  "arrow-next": "M8 4l6 6-6 6M18 10H6",
  sun: "M10 6.8a3.2 3.2 0 1 0 0 6.4a3.2 3.2 0 1 0 0 -6.4 M14.3 10L16.3 10 M13.04 13.04L14.45 14.45 M10 14.3L10 16.3 M6.96 13.04L5.55 14.45 M5.7 10L3.7 10 M6.96 6.96L5.55 5.55 M10 5.7L10 3.7 M13.04 6.96L14.45 5.55",
  moon: "M17.5 10.66A7.5 7.5 0 1 1 9.34 2.5 5.83 5.83 0 0 0 17.5 10.66z",
  expand: "M4 8V4h4M16 4v4h-4M4 12v4h4M16 16v-4h-4",
  download: "M10 3v10M6 9l4 4 4-4M4 16h12",
  note: "M4 3h9l3 3v11H4V3zM13 3v3h3M7 9h6M7 12h6M7 15h3"
};

export function Icon({ name, className }: { name: IconName; className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d={paths[name]} />
    </svg>
  );
}
