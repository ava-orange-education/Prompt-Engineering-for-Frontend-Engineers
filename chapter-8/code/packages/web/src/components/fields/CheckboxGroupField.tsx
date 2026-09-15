import { useFormContext, useWatch }  from "react-hook-form";
import { Checkbox }                  from "@/components/ui/checkbox";
import { FieldWrapper }              from "./FieldWrapper";
import type { FieldConfig }          from "@formforge/types";

export function CheckboxGroupField({ field }: { field: FieldConfig }) {
  const { setValue, formState: { errors } } = useFormContext();
  const current: string[] = useWatch({ name: field.name }) ?? [];
  const error = errors[field.name]?.message as string | undefined;
  function toggle(value: string) {
    const next = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    setValue(field.name, next, { shouldValidate: true });
  }
  return (
    <FieldWrapper field={field} error={error}>
      <div role="group" aria-labelledby={`${field.name}-label`} className="space-y-2">
        {(field.options ?? []).map(opt => (
          <div key={String(opt.value)} className="flex items-center gap-2">
            <Checkbox
              id={`${field.name}-${opt.value}`}
              checked={current.includes(String(opt.value))}
              onCheckedChange={() => toggle(String(opt.value))}
              disabled={opt.disabled || field.disabled}
            />
            <label htmlFor={`${field.name}-${opt.value}`} className="text-sm">
              {opt.label}
            </label>
          </div>
        ))}
      </div>
    </FieldWrapper>
  );
}
