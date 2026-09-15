import type { FormConfig, FormField, VisibleWhen } from '@formforge/types';

export type FieldValue = string | number | boolean | string[] | undefined;
export type FormValues = Record<string, FieldValue>;
export type FormErrors = Record<string, string>;

interface DynamicFormProps {
  config: FormConfig;
  values: FormValues;
  errors: FormErrors;
  onChange: (name: string, value: FieldValue) => void;
}

export function isFieldVisible(field: FormField, values: FormValues): boolean {
  if (!field.visibleWhen) return true;
  return evaluateVisibleWhen(field.visibleWhen, values);
}

function evaluateVisibleWhen(rule: VisibleWhen, values: FormValues): boolean {
  const current = values[rule.dependsOn];
  switch (rule.operator) {
    case 'eq':
      return current === rule.value;
    case 'neq':
      return current !== rule.value;
    case 'gt':
      return typeof current === 'number' && current > Number(rule.value);
    case 'lt':
      return typeof current === 'number' && current < Number(rule.value);
    case 'contains':
      if (Array.isArray(current)) return current.includes(String(rule.value));
      return typeof current === 'string' && current.includes(String(rule.value));
    case 'empty':
      return isEmptyValue(current);
    case 'notEmpty':
      return !isEmptyValue(current);
    default:
      return true;
  }
}

function isEmptyValue(value: FieldValue): boolean {
  if (value === undefined || value === null || value === '') return true;
  if (Array.isArray(value)) return value.length === 0;
  return false;
}

const columnClasses: Record<1 | 2 | 3, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-3',
};

export function DynamicForm({ config, values, errors, onChange }: DynamicFormProps) {
  return (
    <div className="space-y-8">
      {config.sections.map((section) => (
        <section key={section.id}>
          {section.title && (
            <h2 className="mb-1 text-lg font-semibold text-gray-900">{section.title}</h2>
          )}
          {section.description && (
            <p className="mb-4 text-sm text-gray-500">{section.description}</p>
          )}
          <div className={`grid gap-4 ${columnClasses[section.columns ?? 1]}`}>
            {section.fields.map((field) => {
              if (field.type === 'hidden') {
                return (
                  <input
                    key={field.name}
                    type="hidden"
                    name={field.name}
                    value={toInputValue(values[field.name])}
                  />
                );
              }
              if (!isFieldVisible(field, values)) return null;
              return (
                <div key={field.name} className={field.width === 'full' ? 'col-span-full' : ''}>
                  <FieldControl
                    field={field}
                    value={values[field.name]}
                    error={errors[field.name]}
                    onChange={(value) => onChange(field.name, value)}
                  />
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

function toInputValue(value: FieldValue): string {
  if (value === undefined || value === null) return '';
  if (Array.isArray(value)) return value.join(',');
  return String(value);
}

interface FieldControlProps {
  field: FormField;
  value: FieldValue;
  error?: string;
  onChange: (value: FieldValue) => void;
}

function FieldControl({ field, value, error, onChange }: FieldControlProps) {
  const inputId = field.name;
  const describedBy = [field.helpText && `${inputId}-help`, error && `${inputId}-error`]
    .filter(Boolean)
    .join(' ') || undefined;

  const baseInputClasses =
    'block w-full rounded-md border px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 ' +
    (error ? 'border-red-400' : 'border-gray-300');

  switch (field.type) {
    case 'text':
    case 'email':
    case 'password':
    case 'tel':
    case 'url':
      return (
        <Labeled field={field} inputId={inputId} error={error}>
          <input
            id={inputId}
            name={field.name}
            type={field.type}
            value={toInputValue(value)}
            placeholder={field.placeholder}
            onChange={(e) => onChange(e.target.value)}
            aria-describedby={describedBy}
            className={baseInputClasses}
          />
        </Labeled>
      );

    case 'number':
      return (
        <Labeled field={field} inputId={inputId} error={error}>
          <input
            id={inputId}
            name={field.name}
            type="number"
            value={value === undefined ? '' : String(value)}
            placeholder={field.placeholder}
            min={field.validation?.min}
            max={field.validation?.max}
            onChange={(e) => onChange(e.target.value === '' ? undefined : Number(e.target.value))}
            aria-describedby={describedBy}
            className={baseInputClasses}
          />
        </Labeled>
      );

    case 'textarea':
      return (
        <Labeled field={field} inputId={inputId} error={error}>
          <textarea
            id={inputId}
            name={field.name}
            rows={4}
            value={toInputValue(value)}
            placeholder={field.placeholder}
            onChange={(e) => onChange(e.target.value)}
            aria-describedby={describedBy}
            className={baseInputClasses}
          />
        </Labeled>
      );

    case 'select':
      return (
        <Labeled field={field} inputId={inputId} error={error}>
          <select
            id={inputId}
            name={field.name}
            value={toInputValue(value)}
            onChange={(e) => onChange(e.target.value)}
            aria-describedby={describedBy}
            className={baseInputClasses}
          >
            <option value="" disabled>
              {field.placeholder ?? 'Select an option'}
            </option>
            {(field.options ?? []).map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </Labeled>
      );

    case 'multiselect': {
      const selected = Array.isArray(value) ? value : [];
      return (
        <Labeled field={field} inputId={inputId} error={error}>
          <select
            id={inputId}
            name={field.name}
            multiple
            value={selected}
            onChange={(e) =>
              onChange(Array.from(e.target.selectedOptions).map((o) => o.value))
            }
            aria-describedby={describedBy}
            className={baseInputClasses}
          >
            {(field.options ?? []).map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </Labeled>
      );
    }

    case 'radio':
      // Radio groups have no single control to attach one id={field.name}
      // label to, so the field label becomes a <legend> and each option
      // gets its own htmlFor'd <label>, per usual fieldset/legend practice.
      return (
        <fieldset aria-describedby={describedBy}>
          <legend className="mb-1.5 block text-sm font-medium text-gray-900">
            {field.label}
            {field.validation?.required && <span className="text-red-500"> *</span>}
          </legend>
          <div className="space-y-1.5">
            {(field.options ?? []).map((opt) => {
              const optionId = `${field.name}-${opt.value}`;
              return (
                <label key={opt.value} htmlFor={optionId} className="flex items-center gap-2 text-sm text-gray-800">
                  <input
                    id={optionId}
                    type="radio"
                    name={field.name}
                    value={opt.value}
                    checked={value === opt.value}
                    onChange={() => onChange(opt.value)}
                    className="h-4 w-4"
                  />
                  {opt.label}
                </label>
              );
            })}
          </div>
          <FieldFootnotes field={field} error={error} inputId={inputId} />
        </fieldset>
      );

    case 'checkbox':
      return (
        <div>
          <label htmlFor={inputId} className="flex items-center gap-2 text-sm text-gray-900">
            <input
              id={inputId}
              name={field.name}
              type="checkbox"
              checked={Boolean(value)}
              onChange={(e) => onChange(e.target.checked)}
              aria-describedby={describedBy}
              className="h-4 w-4"
            />
            {field.label}
          </label>
          <FieldFootnotes field={field} error={error} inputId={inputId} />
        </div>
      );

    case 'checkbox-group': {
      const selected = Array.isArray(value) ? value : [];
      return (
        <fieldset aria-describedby={describedBy}>
          <legend className="mb-1.5 block text-sm font-medium text-gray-900">
            {field.label}
            {field.validation?.required && <span className="text-red-500"> *</span>}
          </legend>
          <div className="space-y-1.5">
            {(field.options ?? []).map((opt) => {
              const optionId = `${field.name}-${opt.value}`;
              const checked = selected.includes(String(opt.value));
              return (
                <label key={opt.value} htmlFor={optionId} className="flex items-center gap-2 text-sm text-gray-800">
                  <input
                    id={optionId}
                    type="checkbox"
                    name={field.name}
                    value={opt.value}
                    checked={checked}
                    onChange={(e) =>
                      onChange(
                        e.target.checked
                          ? [...selected, String(opt.value)]
                          : selected.filter((v) => v !== String(opt.value)),
                      )
                    }
                    className="h-4 w-4"
                  />
                  {opt.label}
                </label>
              );
            })}
          </div>
          <FieldFootnotes field={field} error={error} inputId={inputId} />
        </fieldset>
      );
    }

    case 'date':
    case 'time':
      return (
        <Labeled field={field} inputId={inputId} error={error}>
          <input
            id={inputId}
            name={field.name}
            type={field.type}
            value={toInputValue(value)}
            onChange={(e) => onChange(e.target.value)}
            aria-describedby={describedBy}
            className={baseInputClasses}
          />
        </Labeled>
      );

    case 'datetime':
      return (
        <Labeled field={field} inputId={inputId} error={error}>
          <input
            id={inputId}
            name={field.name}
            type="datetime-local"
            value={toInputValue(value)}
            onChange={(e) => onChange(e.target.value)}
            aria-describedby={describedBy}
            className={baseInputClasses}
          />
        </Labeled>
      );

    case 'file':
      return (
        <Labeled field={field} inputId={inputId} error={error}>
          <input
            id={inputId}
            name={field.name}
            type="file"
            onChange={(e) => onChange(e.target.files?.[0]?.name)}
            aria-describedby={describedBy}
            className="block w-full text-sm text-gray-700 file:mr-3 file:rounded-md file:border-0 file:bg-indigo-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-indigo-700"
          />
        </Labeled>
      );

    case 'slider':
      return (
        <Labeled field={field} inputId={inputId} error={error}>
          <input
            id={inputId}
            name={field.name}
            type="range"
            min={field.validation?.min ?? 0}
            max={field.validation?.max ?? 100}
            value={value === undefined ? (field.validation?.min ?? 0) : Number(value)}
            onChange={(e) => onChange(Number(e.target.value))}
            aria-describedby={describedBy}
            className="w-full"
          />
        </Labeled>
      );

    case 'rating': {
      const max = field.validation?.max ?? 5;
      const current = value === undefined ? 0 : Number(value);
      return (
        <Labeled field={field} inputId={inputId} error={error}>
          <div id={inputId} role="radiogroup" aria-describedby={describedBy} className="flex gap-1">
            {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                aria-label={`${n} star${n === 1 ? '' : 's'}`}
                aria-pressed={n <= current}
                onClick={() => onChange(n)}
                className={`text-2xl leading-none ${n <= current ? 'text-amber-400' : 'text-gray-300'}`}
              >
                ★
              </button>
            ))}
          </div>
        </Labeled>
      );
    }

    default:
      return (
        <div className="rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">
          Unsupported field type "{field.type}" for field "{field.name}".
        </div>
      );
  }
}

function Labeled({
  field,
  inputId,
  error,
  children,
}: {
  field: FormField;
  inputId: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-gray-900">
        {field.label}
        {field.validation?.required && <span className="text-red-500"> *</span>}
      </label>
      {children}
      <FieldFootnotes field={field} error={error} inputId={inputId} />
    </div>
  );
}

function FieldFootnotes({ field, error, inputId }: { field: FormField; error?: string; inputId: string }) {
  return (
    <>
      {field.helpText && !error && (
        <p id={`${inputId}-help`} className="mt-1 text-xs text-gray-500">
          {field.helpText}
        </p>
      )}
      {error && (
        <p id={`${inputId}-error`} className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </>
  );
}
