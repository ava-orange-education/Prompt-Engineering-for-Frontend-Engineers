import { Controller, useFormContext } from "react-hook-form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FieldWrapper }    from "./FieldWrapper";
import type { FieldConfig } from "@formforge/types";

export function RadioGroupField({ field }: { field: FieldConfig }) {
  const { control, formState: { errors } } = useFormContext();
  const error = errors[field.name]?.message as string | undefined;
  return (
    <FieldWrapper field={field} error={error}>
      <Controller
        control={control}
        name={field.name}
        render={({ field: f }) => (
          <RadioGroup
            value={f.value}
            onValueChange={f.onChange}
            disabled={field.disabled}
            aria-invalid={!!error}
            aria-labelledby={`${field.name}-label`}
            className="space-y-2"
          >
            {(field.options ?? []).map(opt => (
              <div key={String(opt.value)} className="flex items-center gap-2">
                <RadioGroupItem
                  id={`${field.name}-${opt.value}`}
                  value={String(opt.value)}
                  disabled={opt.disabled}
                />
                <label htmlFor={`${field.name}-${opt.value}`} className="text-sm">
                  {opt.label}
                </label>
              </div>
            ))}
          </RadioGroup>
        )}
      />
    </FieldWrapper>
  );
}
