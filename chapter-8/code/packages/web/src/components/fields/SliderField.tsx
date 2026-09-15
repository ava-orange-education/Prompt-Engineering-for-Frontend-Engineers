import { Controller, useFormContext } from "react-hook-form";
import { Slider }          from "@/components/ui/slider";
import { FieldWrapper }    from "./FieldWrapper";
import type { FieldConfig } from "@formforge/types";

export function SliderField({ field }: { field: FieldConfig }) {
  const { control, formState: { errors } } = useFormContext();
  const error = errors[field.name]?.message as string | undefined;
  const min = field.validation?.min ?? 0;
  const max = field.validation?.max ?? 100;
  return (
    <FieldWrapper field={field} error={error}>
      <Controller
        control={control}
        name={field.name}
        render={({ field: f }) => (
          <div className="flex items-center gap-3">
            <Slider
              id={field.name}
              min={min}
              max={max}
              step={1}
              disabled={field.disabled}
              value={[Number.isNaN(Number(f.value)) ? min : Number(f.value)]}
              onValueChange={(v) => f.onChange(Array.isArray(v) ? v[0] : v)}
              className="flex-1"
            />
            <span className="text-sm tabular-nums w-8 text-right">
              {Number.isNaN(Number(f.value)) ? min : Number(f.value)}
            </span>
          </div>
        )}
      />
    </FieldWrapper>
  );
}
