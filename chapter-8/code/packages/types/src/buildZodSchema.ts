import { z } from "zod";
import type { FieldConfig, FormConfig, VisibilityRule } from "./index.js";

// Environment-agnostic core of the submission-validation schema, shared by
// packages/web (client-side react-hook-form validation) and packages/api
// (server-side validation of submitted values against the form's own
// config — see FormConfigController.submitForm) so both sides enforce
// exactly the same rules for every field EXCEPT "file".
//
// "file" is the one field type whose correct Zod schema genuinely differs
// per environment: in the browser a file input's real DOM value is a
// FileList; on the server, submitted values arrive as plain JSON, so
// there's no FileList to validate against. Rather than fork this whole
// module per environment, callers supply their own file-field schema via
// `buildFileFieldSchema` and get everything else for free. See
// packages/web/src/components/DynamicForm/buildZodSchema.ts and
// packages/api/src/form-config/buildZodSchema.ts for the two extensions.
export type FileFieldSchemaBuilder = (field: FieldConfig, required: boolean) => z.ZodType;

export function evaluateVisibility(rule: VisibilityRule | undefined, data: Record<string, unknown>): boolean {
  if (!rule) return true;
  const watched = data[rule.dependsOn];
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

function isEmptyValue(value: unknown): boolean {
  if (value === undefined || value === null || value === "") return true;
  if (Array.isArray(value)) return value.length === 0;
  return false;
}

function buildFieldSchema(field: FieldConfig, buildFileFieldSchema: FileFieldSchemaBuilder): z.ZodType {
  const v = field.validation ?? {};
  // A field behind a visibleWhen condition must never be enforced as
  // required by the static per-field schema — it may be hidden and thus
  // never touched by the user. Its requiredness (when actually visible)
  // is instead enforced conditionally in buildZodSchemaCore's superRefine.
  const required = v.required && !field.visibleWhen;
  let schema: z.ZodType;
  if (field.type === "number" || field.type === "slider" || field.type === "rating") {
    let s = z.coerce.number();
    if (v.min !== undefined) s = s.min(v.min, { error: v.message ?? `${field.label} must be at least ${v.min}.` });
    if (v.max !== undefined) s = s.max(v.max, { error: v.message ?? `${field.label} must be at most ${v.max}.` });
    schema = s;
  } else if (field.type === "checkbox") {
    schema = required
      ? z.literal(true, { error: v.message ?? `${field.label} is required.` })
      : z.boolean().optional();
  } else if (field.type === "multiselect" || field.type === "checkbox-group") {
    let s = z.array(z.string());
    if (required) s = s.min(1, { error: v.message ?? "Select at least one option." });
    schema = s;
  } else if (field.type === "file") {
    schema = buildFileFieldSchema(field, !!required);
  } else {
    let s = z.string();
    if (required) s = s.min(1, { error: v.message ?? `${field.label} is required.` });
    if (v.email) s = s.email({ error: v.message ?? "Must be a valid email address." });
    if (v.url) s = s.url({ error: v.message ?? "Must be a valid URL." });
    // Zod 4 also promotes top-level z.email() / z.url() as tree-shakable
    // equivalents of these chained calls — both forms work identically;
    // buildFieldSchema sticks with the chained form to stay consistent
    // with the rest of this method chain.
    if (v.minLength) s = s.min(v.minLength, { error: v.message ?? `Min ${v.minLength} chars.` });
    if (v.maxLength) s = s.max(v.maxLength, { error: v.message ?? `Max ${v.maxLength} chars.` });
    if (v.pattern) s = s.regex(new RegExp(v.pattern), { error: v.message ?? "Invalid format." });
    schema = s;
  }
  if (!required && field.type !== "checkbox" && field.type !== "file")
    schema = schema.optional().or(z.literal(""));
  return schema;
}

/** Builds the full submission-validation schema for a FormConfig. Callers
 *  supply `buildFileFieldSchema` to handle the one field type ("file")
 *  whose correct Zod schema differs between the browser and the server. */
export function buildZodSchemaCore(config: FormConfig, buildFileFieldSchema: FileFieldSchemaBuilder): z.ZodObject {
  const shape: Record<string, z.ZodType> = {};
  const conditionallyRequired: FieldConfig[] = [];
  config.sections.forEach(s =>
    s.fields.forEach(f => {
      if (f.type === "hidden") return;
      shape[f.name] = buildFieldSchema(f, buildFileFieldSchema);
      if (f.validation?.required && f.visibleWhen) conditionallyRequired.push(f);
    })
  );
  return z.object(shape).superRefine((data, ctx) => {
    // A required field behind visibleWhen is only enforced while it's
    // actually visible — a hidden required field must never block submission.
    conditionallyRequired.forEach(field => {
      if (!evaluateVisibility(field.visibleWhen, data)) return;
      if (isEmptyValue(data[field.name])) {
        ctx.addIssue({
          code: "custom",
          path: [field.name],
          message: field.validation?.message ?? `${field.label} is required.`,
        });
      }
    });
  });
}
