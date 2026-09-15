"use client";

import { useActionState } from "react";
import { updateProfile } from "@/app/actions"; // "use server" function

// From the book, section "Hooks and the Actions API"
// useActionState connects a Server Action to local pending/error state
export function ProfileForm({ user }: { user: { displayName: string } }) {
  const [state, formAction, isPending] = useActionState(updateProfile, {
    error: null,
    success: false,
  });
  // The form submits directly to the Server Action — no fetch(), no useState for loading
  return (
    <form action={formAction}>
      <input name="displayName" defaultValue={user.displayName} />
      {state.error && <p className="error">{state.error}</p>}
      <button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Save"}
      </button>
      {state.success && <p>Saved.</p>}
    </form>
  );
}
