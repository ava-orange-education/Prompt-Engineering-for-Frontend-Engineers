import { Controller, useFormContext }    from "react-hook-form";
import { Select, SelectContent,
         SelectItem, SelectTrigger,
         SelectValue }                   from "@/components/ui/select";
import { FieldWrapper }                  from "./FieldWrapper";
import type { FieldConfig }              from "@formforge/types";

export function SelectField({ field }: { field: FieldConfig }) {
  const { control, formState: { errors } } = useFormContext();
  const error = errors[field.name]?.message as string | undefined;
  return (
    <FieldWrapper field={field} error={error}>
      <Controller
        control={control}
        name={field.name}
        render={({ field: f }) => (
          <Select
            value={f.value}
            onValueChange={f.onChange}
            disabled={field.disabled}
          >
            <SelectTrigger
              id={field.name}
              aria-invalid={!!error}
              aria-describedby={error ? `${field.name}-error` : undefined}
              className={`w-full ${error ? "border-destructive" : ""}`}
            >
              <SelectValue placeholder="--- Select an option ---" />
            </SelectTrigger>
            <SelectContent>
              {(field.options ?? []).map(opt => (
                <SelectItem
                  key={String(opt.value)}
                  value={String(opt.value)}
                  disabled={opt.disabled}
                >
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
    </FieldWrapper>
  );
}
