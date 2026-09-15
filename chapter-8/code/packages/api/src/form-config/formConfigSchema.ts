import { z } from "zod";
import type { FormConfig } from "@formforge/types";

export class FormConfigValidationError extends Error {
  constructor(public readonly formId: string, public readonly issues: z.ZodError["issues"]) {
    super(`Invalid form configuration for "${formId}"`);
    this.name = "FormConfigValidationError";
  }
}

const fieldConfigSchema = z.object({
  name: z.string(),
  type: z.string(),
  label: z.string(),
  placeholder: z.string().optional(),
  defaultValue: z.union([z.string(), z.number(), z.boolean(), z.array(z.string())]).optional(),
  helpText: z.string().optional(),
  readOnly: z.boolean().optional(),
  disabled: z.boolean().optional(),
  width: z.enum(["full", "half", "third"]).optional(),
  options: z.array(z.any()).optional(),
  validation: z.any().optional(),
  visibleWhen: z.any().optional(),
  attrs: z.record(z.string(), z.string()).optional(),
});

const sectionConfigSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
  columns: z.union([z.literal(1), z.literal(2), z.literal(3)]).optional(),
  fields: z.array(fieldConfigSchema),
});

const formConfigSchema = z.object({
  formId: z.string(),
  title: z.string(),
  description: z.string().optional(),
  submitLabel: z.string().optional(),
  successMessage: z.string().optional(),
  sections: z.array(sectionConfigSchema),
});

export function parseFormConfig(raw: unknown, formId: string): FormConfig {
  const result = formConfigSchema.safeParse(raw);
  if (!result.success) {
    throw new FormConfigValidationError(formId, result.error.issues);
  }
  return result.data as FormConfig;
}
