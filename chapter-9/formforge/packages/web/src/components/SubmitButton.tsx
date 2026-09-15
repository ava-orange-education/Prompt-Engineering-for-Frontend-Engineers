import { useFormStatus } from 'react-dom';

interface SubmitButtonProps {
  label: string;
}

// useFormStatus only reports the status of the nearest parent <form>, and
// only for components rendered *inside* it — hence this is split out from
// FormPage, which renders the <form> element itself.
export function SubmitButton({ label }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? 'Submitting…' : label}
    </button>
  );
}
