import { z }              from "zod";
import type { FieldConfig, FormConfig } from "@formforge/types";
import { buildZodSchemaCore } from "@formforge/types";

// A file input's real DOM value is a FileList, never a string — treating
// it as text (the old default-branch behavior) rejects every upload
// with "expected string, received FileList" the moment a file is chosen.
// This is the one piece of the schema that's genuinely browser-specific;
// everything else comes from the shared core in @formforge/types.
function webFileFieldSchema(field: FieldConfig, required: boolean): z.ZodType {
  return required
    ? z.instanceof(FileList).refine(f => f.length > 0, field.validation?.message ?? `${field.label} is required.`)
    : z.instanceof(FileList).optional();
}

export function buildZodSchema(config: FormConfig): z.ZodObject {
  return buildZodSchemaCore(config, webFileFieldSchema);
}

// React Hook Form needs every field pre-seeded with a value of the right
// shape (a checkbox needs false, not undefined; a checkbox-group needs
// [], not undefined) or its first render is treated as an uncontrolled-
// to-controlled transition, which React logs a warning for and which Zod
// coercion can choke on.
export function buildDefaultValues(config: FormConfig): Record<string, unknown> {
  const values: Record<string, unknown> = {};
  config.sections.forEach(section =>
    section.fields.forEach(field => {
      if (field.defaultValue !== undefined) {
        values[field.name] = field.defaultValue;
        return;
      }
      switch (field.type) {
        case "checkbox":
          values[field.name] = false;
          break;
        case "multiselect":
        case "checkbox-group":
          values[field.name] = [];
          break;
        case "number":
        case "slider":
          values[field.name] = field.validation?.min ?? 0;
          break;
        case "rating":
          values[field.name] = 0;
          break;
        case "file":
          values[field.name] = undefined;
          break;
        default:
          values[field.name] = "";
      }
    })
  );
  return values;
}
