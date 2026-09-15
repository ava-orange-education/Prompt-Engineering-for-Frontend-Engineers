import { Controller, useFormContext } from "react-hook-form";
import { Checkbox }        from "@/components/ui/checkbox";
import { FieldWrapper }    from "./FieldWrapper";
import type { FieldConfig } from "@formforge/types";

export function CheckboxField({ field }: { field: FieldConfig }) {
  const { control, formState: { errors } } = useFormContext();
  const error = errors[field.name]?.message as string | undefined;
  return (
    <FieldWrapper field={field} error={error} hideLabel>
      <Controller
        control={control}
        name={field.name}
        render={({ field: f }) => (
          <div className="flex items-center gap-2">
            <Checkbox
              id={field.name}
              checked={!!f.value}
              onCheckedChange={f.onChange}
              disabled={field.disabled}
              aria-invalid={!!error}
            />
            <label htmlFor={field.name} className="text-sm">
              {field.label}
              {field.validation?.required && <span className="text-destructive ml-0.5"> *</span>}
            </label>
          </div>
        )}
      />
    </FieldWrapper>
  );
}
