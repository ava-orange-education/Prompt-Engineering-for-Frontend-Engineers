import { useCallback, useEffect, useState } from 'react';
import type { FormConfig } from '@formforge/types';

interface UseFormConfigResult {
  config: FormConfig | null;
  loading: boolean;
  error: string | null;
  retry: () => void;
}

export function useFormConfig(formId: string): UseFormConfigResult {
  const [config, setConfig] = useState<FormConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(`/api/forms/${formId}`)
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json().catch(() => null);
          throw new Error(body?.message ?? `Failed to load form "${formId}".`);
        }
        return (await res.json()) as FormConfig;
      })
      .then((data) => {
        if (!cancelled) setConfig(data);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Something went wrong loading this form.');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [formId, attempt]);

  const retry = useCallback(() => setAttempt((a) => a + 1), []);

  return { config, loading, error, retry };
}
