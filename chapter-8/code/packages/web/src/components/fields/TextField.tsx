import { Input }           from "@/components/ui/input";
import { useFormContext }  from "react-hook-form";
import { FieldWrapper }    from "./FieldWrapper";
import type { FieldConfig } from "@formforge/types";

export function TextField({ field }: { field: FieldConfig }) {
  const { register, formState: { errors } } = useFormContext();
  const error = errors[field.name]?.message as string | undefined;
  return (
    <FieldWrapper field={field} error={error}>
      <Input
        id={field.name}
        type={field.type}
        placeholder={field.placeholder}
        readOnly={field.readOnly}
        disabled={field.disabled}
        aria-describedby={error ? `${field.name}-error` : undefined}
        aria-invalid={!!error}
        className={error ? "border-destructive focus-visible:ring-destructive" : ""}
        {...field.attrs}
        {...register(field.name)}
      />
    </FieldWrapper>
  );
}
