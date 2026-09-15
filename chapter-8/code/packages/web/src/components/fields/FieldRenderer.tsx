import { useFormContext, useWatch } from "react-hook-form";
import type { FieldConfig, VisibilityRule } from "@formforge/types";
import { TextField }          from "./TextField";
import { TextAreaField }      from "./TextAreaField";
import { SelectField }        from "./SelectField";
import { FieldWrapper }       from "./FieldWrapper";
import { RadioGroupField }    from "./RadioGroupField";
import { CheckboxField }      from "./CheckboxField";
import { CheckboxGroupField } from "./CheckboxGroupField";
import { DateField }          from "./DateField";
import { SliderField }        from "./SliderField";
import { RatingField }        from "./RatingField";
import { FileUploadField }    from "./FileUploadField";

function useIsVisible(rule?: VisibilityRule): boolean {
  const watched = useWatch({ name: rule?.dependsOn ?? "" });
  if (!rule) return true;
  switch (rule.operator) {
    case "eq":       return watched === rule.value;
    case "neq":      return watched !== rule.value;
    case "gt":       return Number(watched) > Number(rule.value);
    case "lt":       return Number(watched) < Number(rule.value);
    case "contains": return String(watched).includes(String(rule.value));
    case "empty":    return !watched || watched === "";
    case "notEmpty": return !!watched && watched !== "";
    default:         return true;
  }
}

const WIDTH = { full: "col-span-12", half: "col-span-6", third: "col-span-4" };

export function FieldRenderer({ field }: { field: FieldConfig }) {
  // Call all hooks unconditionally at the top level — never inside the
  // switch below, which is plain control flow, not a hook rule exception.
  const { register } = useFormContext();
  const visible = useIsVisible(field.visibleWhen);
  if (!visible) return null;
  const el = (() => {
    switch (field.type) {
      case "text": case "email": case "password":
      case "tel":  case "url":   case "number":
        return <TextField field={field} />;
      case "textarea":       return <TextAreaField      field={field} />;
      case "select":         return <SelectField        field={field} />;
      case "multiselect":
        return (
          <FieldWrapper field={field} error={`"multiselect" is not implemented for this field.`}>
            <p className="text-sm text-muted-foreground italic">
              Multiselect fields aren't implemented in this example. A real
              implementation would need a Combobox pattern (Popover + Command)
              or a native &lt;select multiple&gt; styled with Tailwind classes.
            </p>
          </FieldWrapper>
        );
      case "radio":          return <RadioGroupField    field={field} />;
      case "checkbox":       return <CheckboxField      field={field} />;
      case "checkbox-group": return <CheckboxGroupField field={field} />;
      case "date": case "datetime": case "time":
        return <DateField field={field} />;
      case "slider":  return <SliderField field={field} />;
      case "rating":  return <RatingField  field={field} />;
      case "file":    return <FileUploadField field={field} />;
      case "hidden":  return <input type="hidden" {...register(field.name)} />;
      default: return <p className="text-destructive">Unknown type: {(field as any).type}</p>;
    }
  })();
  return <div className={WIDTH[field.width ?? "full"]}>{el}</div>;
}
