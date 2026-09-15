import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { FormSummary } from '@formforge/types';

export default function FormList() {
  const [forms, setForms] = useState<FormSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState(0);

  const retry = useCallback(() => setAttempt((a) => a + 1), []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch('/api/forms')
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to load the list of forms.');
        return (await res.json()) as FormSummary[];
      })
      .then((data) => {
        if (!cancelled) setForms(data);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Something went wrong loading forms.');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [attempt]);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-900">Available Forms</h1>
        <p className="mt-1 text-sm text-gray-600">Choose a form to get started.</p>

        <div className="mt-6">
          {loading && <LoadingSkeleton />}

          {!loading && error && <ErrorState message={error} onRetry={retry} />}

          {!loading && !error && forms && forms.length === 0 && (
            <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
              <p className="text-sm text-gray-600">No forms available yet.</p>
            </div>
          )}

          {!loading && !error && forms && forms.length > 0 && (
            <ul className="space-y-3">
              {forms.map((form) => (
                <li key={form.formId}>
                  <Link
                    to={`/forms/${form.formId}`}
                    className="block rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-indigo-300 hover:shadow-md"
                  >
                    <h2 className="text-base font-semibold text-gray-900">{form.title}</h2>
                    {form.description && (
                      <p className="mt-1 text-sm text-gray-600">{form.description}</p>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="h-4 w-1/3 rounded bg-gray-200" />
          <div className="mt-2 h-3 w-2/3 rounded bg-gray-100" />
        </div>
      ))}
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
      <h2 className="text-base font-semibold text-gray-900">Couldn't load forms</h2>
      <p className="mt-2 text-sm text-gray-600">{message}</p>
      <button
        onClick={onRetry}
        className="mt-5 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
      >
        Try again
      </button>
    </div>
  );
}
