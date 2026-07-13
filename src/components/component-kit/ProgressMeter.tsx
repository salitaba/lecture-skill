export interface ProgressMeterProps {
  value?: number;
  label: string;
  size?: "default" | "mini";
}

export function ProgressMeter({ value, label, size = "default" }: ProgressMeterProps) {
  const trackClass = ["progress-meter-track", size === "mini" ? "progress-meter-track-mini" : null].filter(Boolean).join(" ");

  return (
    <div
      className={trackClass}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      {...(value === undefined ? {} : { "aria-valuenow": value })}
    >
      <span className="progress-meter-fill" style={{ width: `${value ?? 0}%` }} />
    </div>
  );
}
