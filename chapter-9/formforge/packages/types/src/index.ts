export type FieldType =
  | 'text' | 'email' | 'password' | 'number' | 'tel' | 'url'
  | 'textarea' | 'select' | 'multiselect' | 'radio' | 'checkbox'
  | 'checkbox-group' | 'date' | 'datetime' | 'time' | 'file'
  | 'slider' | 'rating' | 'hidden';

export type FieldWidth = 'full' | 'half' | 'third';

export type VisibleWhenOperator =
  | 'eq' | 'neq' | 'gt' | 'lt' | 'contains' | 'empty' | 'notEmpty';

export interface FieldOption {
  label: string;
  value: string | number;
}

export interface FieldValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
  message?: string;
  email?: boolean;
  url?: boolean;
}

export interface VisibleWhen {
  dependsOn: string;
  operator: VisibleWhenOperator;
  value: string | number | boolean;
}

export interface FormField {
  name: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  helpText?: string;
  width?: FieldWidth;
  defaultValue?: string | number | boolean | string[];
  options?: FieldOption[];
  validation?: FieldValidation;
  visibleWhen?: VisibleWhen;
}

export interface FormSection {
  id: string;
  title?: string;
  description?: string;
  columns?: 1 | 2 | 3;
  fields: FormField[];
}

export interface FormConfig {
  formId: string;
  title: string;
  description?: string;
  submitLabel?: string;
  successMessage?: string;
  sections: FormSection[];
}

export interface FormSummary {
  formId: string;
  title: string;
  description?: string;
}
