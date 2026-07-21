import type { ReactNode } from "react";

export interface RadioOptionGroupProps {
  name: string;
  options: string[];
  selected: string | null;
  onSelect: (option: string) => void;
  disabled?: boolean;
  optionClassName: string;
  groupClassName: string;
  groupLabelledBy?: string;
  groupDescribedBy?: string;
  idPrefix?: string;
  optionExtraClassName?: (option: string) => string | undefined;
  /** Rendered before the options, inside the `role="radiogroup"` wrapper (e.g. a hidden accessible-name span). */
  children?: ReactNode;
}

export function RadioOptionGroup({
  name,
  options,
  selected,
  onSelect,
  disabled = false,
  optionClassName,
  groupClassName,
  groupLabelledBy,
  groupDescribedBy,
  idPrefix,
  optionExtraClassName,
  children
}: RadioOptionGroupProps) {
  return (
    <div className={groupClassName} role="radiogroup" aria-labelledby={groupLabelledBy} aria-describedby={groupDescribedBy}>
      {children}
      {options.map((option, index) => (
        <label key={`${option}-${index}`} className={[optionClassName, optionExtraClassName?.(option)].filter(Boolean).join(" ")}>
          <input
            type="radio"
            name={name}
            id={idPrefix ? `${idPrefix}-${index}` : undefined}
            value={option}
            checked={selected === option}
            onChange={() => onSelect(option)}
            disabled={disabled}
          />
          <span>{option}</span>
        </label>
      ))}
    </div>
  );
}
