import type { KeyboardEvent }       from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { Star }                     from "lucide-react";
import { FieldWrapper }             from "./FieldWrapper";
import type { FieldConfig }         from "@formforge/types";

export function RatingField({ field }: { field: FieldConfig }) {
  const { setValue, formState: { errors } } = useFormContext();
  const watched = Number(useWatch({ name: field.name }));
  const current = Number.isNaN(watched) ? 0 : watched;
  const error = errors[field.name]?.message as string | undefined;
  const max = field.validation?.max ?? 5;
  const values = Array.from({ length: max }, (_, i) => i + 1);
  function select(value: number) {
    setValue(field.name, value, { shouldValidate: true });
  }
  // Real radiogroup keyboard behavior: arrow keys move the roving
  // tabindex and select the new value; Home/End jump to the ends.
  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, value: number) {
    let next: number | undefined;
    switch (event.key) {
      case "ArrowRight":
      case "ArrowUp":
        next = value < max ? value + 1 : value;
        break;
      case "ArrowLeft":
      case "ArrowDown":
        next = value > 1 ? value - 1 : value;
        break;
      case "Home":
        next = 1;
        break;
      case "End":
        next = max;
        break;
      default:
        return;
    }
    event.preventDefault();
    select(next);
    const el = event.currentTarget.parentElement?.querySelector<HTMLButtonElement>(
      `[data-value="${next}"]`,
    );
    el?.focus();
  }
  return (
    <FieldWrapper field={field} error={error}>
      <div role="radiogroup" aria-label={field.label} className="flex gap-1">
        {values.map(value => {
          const checked = value === current;
          // Roving tabindex: only the checked option (or the first, when
          // nothing is selected yet) is in the tab order.
          const isTabbable = current > 0 ? checked : value === 1;
          return (
            <button
              key={value}
              type="button"
              role="radio"
              data-value={value}
              aria-checked={checked}
              aria-label={`${value} star${value > 1 ? "s" : ""}`}
              disabled={field.disabled}
              tabIndex={isTabbable ? 0 : -1}
              onClick={() => select(value)}
              onKeyDown={e => onKeyDown(e, value)}
              className="p-0.5"
            >
              <Star
                className={value <= current ? "fill-amber-500 text-amber-500" : "text-muted-foreground"}
                size={20}
              />
            </button>
          );
        })}
      </div>
    </FieldWrapper>
  );
}
