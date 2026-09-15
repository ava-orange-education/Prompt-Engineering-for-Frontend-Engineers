import { Input }           from "@/components/ui/input";
import { useFormContext }  from "react-hook-form";
import { FieldWrapper }    from "./FieldWrapper";
import type { FieldConfig } from "@formforge/types";

const HTML_TYPE = { date: "date", datetime: "datetime-local", time: "time" } as const;

export function DateField({ field }: { field: FieldConfig }) {
  const { register, formState: { errors } } = useFormContext();
  const error = errors[field.name]?.message as string | undefined;
  const inputType = HTML_TYPE[field.type as keyof typeof HTML_TYPE] ?? "date";
  return (
    <FieldWrapper field={field} error={error}>
      <Input
        id={field.name}
        type={inputType}
        readOnly={field.readOnly}
        disabled={field.disabled}
        aria-describedby={error ? `${field.name}-error` : undefined}
        aria-invalid={!!error}
        className={error ? "border-destructive focus-visible:ring-destructive" : ""}
        {...register(field.name)}
      />
    </FieldWrapper>
  );
}
