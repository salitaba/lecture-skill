export type IconName = "chevron" | "check" | "warning" | "arrow-prev" | "arrow-next";

const paths: Record<IconName, string> = {
  chevron: "M6 4l6 6-6 6",
  check: "M4 10.5l4 4L16 6",
  warning: "M10 3.5l8 14H2l8-14zM10 8.5v4M10 15h.01",
  "arrow-prev": "M12 4l-6 6 6 6M6 10h12",
  "arrow-next": "M8 4l6 6-6 6M18 10H6"
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
