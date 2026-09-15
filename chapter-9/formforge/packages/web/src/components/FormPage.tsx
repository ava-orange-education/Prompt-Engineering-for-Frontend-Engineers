import { useMemo, useOptimistic, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { FormConfig, FormField } from '@formforge/types';
import { useFormConfig } from '../hooks/useFormConfig';
import {
  DynamicForm,
  isFieldVisible,
  type FieldValue,
  type FormValues,
  type FormErrors,
} from './DynamicForm';
import { SubmitButton } from './SubmitButton';

export function allFields(config: FormConfig): FormField[] {
  return config.sections.flatMap((s) => s.fields);
}

export function initialValues(fields: FormField[]): FormValues {
  const values: FormValues = {};
  for (const field of fields) {
    if (field.defaultValue !== undefined) values[field.name] = field.defaultValue;
  }
  return values;
}

export function validateField(field: FormField, value: FieldValue): string | undefined {
  const rules = field.validation;
  if (!rules) return undefined;

  const isEmpty =
    value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0);

  if (rules.required && isEmpty) {
    return rules.message ?? `${field.label} is required.`;
  }
  if (isEmpty) return undefined;

  if (typeof value === 'string') {
    if (rules.minLength !== undefined && value.length < rules.minLength) {
      return rules.message ?? `${field.label} must be at least ${rules.minLength} characters.`;
    }
    if (rules.maxLength !== undefined && value.length > rules.maxLength) {
      return rules.message ?? `${field.label} must be at most ${rules.maxLength} characters.`;
    }
    if (rules.pattern && !new RegExp(rules.pattern).test(value)) {
      return rules.message ?? `${field.label} is not valid.`;
    }
    if (rules.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return rules.message ?? `${field.label} must be a valid email address.`;
    }
    if (rules.url) {
      try {
        new URL(value);
      } catch {
        return rules.message ?? `${field.label} must be a valid URL.`;
      }
    }
  }

  if (typeof value === 'number') {
    if (rules.min !== undefined && value < rules.min) {
      return rules.message ?? `${field.label} must be at least ${rules.min}.`;
    }
    if (rules.max !== undefined && value > rules.max) {
      return rules.message ?? `${field.label} must be at most ${rules.max}.`;
    }
  }

  return undefined;
}

export default function FormPage() {
  const { formId } = useParams<{ formId: string }>();
  const { config, loading, error, retry } = useFormConfig(formId ?? '');

  if (loading) return <LoadingSkeleton />;
  if (error || !config) return <ErrorState message={error ?? 'Form not found.'} onRetry={retry} />;

  return <FormPageContent key={config.formId} config={config} />;
}

type SubmitState = { status: 'idle' } | { status: 'success' } | { status: 'error'; message: string };

function FormPageContent({ config }: { config: FormConfig }) {
  const fields = useMemo(() => allFields(config), [config]);
  const [values, setValues] = useState<FormValues>(() => initialValues(fields));
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitState, setSubmitState] = useState<SubmitState>({ status: 'idle' });
  const [optimisticState, setOptimisticState] = useOptimistic<SubmitState, SubmitState>(
    submitState,
    (_current, next) => next,
  );

  function handleChange(name: string, value: FieldValue) {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      if (!(name in prev)) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }

  async function submitAction() {
    // Fields hidden by visibleWhen are excluded here even though `values`
    // may still hold a stale value from before the field was hidden.
    const submittedFields = fields.filter((f) => f.type === 'hidden' || isFieldVisible(f, values));

    const nextErrors: FormErrors = {};
    for (const field of submittedFields) {
      const message = validateField(field, values[field.name]);
      if (message) nextErrors[field.name] = message;
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const payload: FormValues = {};
    for (const field of submittedFields) payload[field.name] = values[field.name];

    setOptimisticState({ status: 'success' });
    try {
      const res = await fetch(`/api/forms/${config.formId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: payload }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.message ?? 'The server rejected this submission.');
      }
      setSubmitState({ status: 'success' });
    } catch (err) {
      setSubmitState({
        status: 'error',
        message: err instanceof Error ? err.message : 'Something went wrong submitting this form.',
      });
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-2xl rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">{config.title}</h1>
        {config.description && <p className="mt-1 text-sm text-gray-600">{config.description}</p>}

        {optimisticState.status === 'success' && (
          <p className="mt-4 rounded-md bg-green-50 px-4 py-3 text-sm font-medium text-green-800">
            {config.successMessage ?? 'Submitted successfully.'}
          </p>
        )}
        {optimisticState.status === 'error' && (
          <p className="mt-4 rounded-md bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
            {optimisticState.message}
          </p>
        )}

        <form action={submitAction} className="mt-6 space-y-8">
          <DynamicForm config={config} values={values} errors={errors} onChange={handleChange} />
          <SubmitButton label={config.submitLabel ?? 'Submit'} />
        </form>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-2xl animate-pulse rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="h-7 w-2/3 rounded bg-gray-200" />
        <div className="mt-3 h-4 w-1/2 rounded bg-gray-100" />
        <div className="mt-8 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="space-y-1.5">
              <div className="h-3 w-24 rounded bg-gray-100" />
              <div className="h-9 w-full rounded bg-gray-100" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="max-w-sm rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-lg font-semibold text-gray-900">Couldn't load this form</h1>
        <p className="mt-2 text-sm text-gray-600">{message}</p>
        <button
          onClick={onRetry}
          className="mt-5 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
