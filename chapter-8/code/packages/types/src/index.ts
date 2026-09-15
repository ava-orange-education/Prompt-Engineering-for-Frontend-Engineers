export interface FieldValidation {
  required?: boolean;   minLength?: number;  maxLength?: number;
  min?: number;         max?: number;        pattern?: string;
  message?: string;     email?: boolean;     url?: boolean;
}
export interface FieldOption {
  label: string;  value: string | number;  disabled?: boolean;
}
export interface VisibilityRule {
  dependsOn: string;
  operator: "eq" | "neq" | "gt" | "lt" | "contains" | "empty" | "notEmpty";
  value: string | number | boolean;
}
export type FieldType =
  | "text" | "email" | "password" | "number" | "tel" | "url"
  | "textarea" | "select" | "multiselect" | "radio"
  | "checkbox" | "checkbox-group" | "date" | "datetime" | "time"
  | "file" | "slider" | "rating" | "hidden";
export interface FieldConfig {
  name: string;         type: FieldType;           label: string;
  placeholder?: string; defaultValue?: string | number | boolean | string[];
  helpText?: string;    readOnly?: boolean;         disabled?: boolean;
  width?: "full" | "half" | "third";
  options?: FieldOption[];
  validation?: FieldValidation;
  visibleWhen?: VisibilityRule;
  attrs?: Record<string, string>;
}
export interface SectionConfig {
  id: string;  title?: string;  description?: string;
  columns?: 1 | 2 | 3;  fields: FieldConfig[];
}
export interface FormConfig {
  formId: string;  title: string;  description?: string;
  submitLabel?: string;  successMessage?: string;
  sections: SectionConfig[];
}
export { buildZodSchemaCore, evaluateVisibility } from "./buildZodSchema.js";
export type { FileFieldSchemaBuilder } from "./buildZodSchema.js";
