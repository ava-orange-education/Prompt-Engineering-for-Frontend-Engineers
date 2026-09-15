import { Textarea }        from "@/components/ui/textarea";
import { useFormContext }  from "react-hook-form";
import { FieldWrapper }    from "./FieldWrapper";
import type { FieldConfig } from "@formforge/types";

export function TextAreaField({ field }: { field: FieldConfig }) {
  const { register, formState: { errors } } = useFormContext();
  const error = errors[field.name]?.message as string | undefined;
  return (
    <FieldWrapper field={field} error={error}>
      <Textarea
        id={field.name}
        placeholder={field.placeholder}
        readOnly={field.readOnly}
        disabled={field.disabled}
        rows={4}
        aria-describedby={error ? `${field.name}-error` : undefined}
        aria-invalid={!!error}
        className={error ? "border-destructive focus-visible:ring-destructive" : ""}
        {...register(field.name)}
      />
    </FieldWrapper>
  );
}
