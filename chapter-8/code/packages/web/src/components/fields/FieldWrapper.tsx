import type { ReactNode }   from "react";
import { Label }            from "@/components/ui/label";
import type { FieldConfig } from "@formforge/types";

interface Props {
  field: FieldConfig;
  error?: string;
  children: ReactNode;
  /** Skip the top-aligned Label — used by fields (e.g. CheckboxField)
   *  that render their own inline label next to the control instead. */
  hideLabel?: boolean;
}

export function FieldWrapper({ field, error, children, hideLabel = false }: Props) {
  return (
    <div className="space-y-1.5">
      {!hideLabel && (
        <Label htmlFor={field.name} id={`${field.name}-label`}>
          {field.label}
          {field.validation?.required && (
            <span aria-hidden="true" className="text-destructive ml-0.5"> *</span>
          )}
        </Label>
      )}
      {children}
      {field.helpText && !error && (
        <p className="text-sm text-muted-foreground">{field.helpText}</p>
      )}
      {error && (
        <p id={`${field.name}-error`} role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
