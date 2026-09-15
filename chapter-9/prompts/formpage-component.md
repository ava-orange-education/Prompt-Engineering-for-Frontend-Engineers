Generate the FormPage React 19 component for the FormForge application.

Behavior:
  - Reads formId from URL via React Router v6 useParams()
  - Fetches FormConfig from GET /api/forms/:formId via useFormConfig hook
  - All fetch calls use relative paths (/api/...), never an absolute localhost 
    origin
  - Shows a full-page loading skeleton while fetching
  - Shows a friendly error state if fetch fails, with a retry button
  - Renders DynamicForm with fetched config
  - Initializes form state from each field's defaultValue where present, so fields
    with a defaultValue are pre-filled on first render rather than starting blank
  - On submit, validates every field against its validation object (required, 
    minLength, maxLength, min, max, pattern) before calling the API; blocks 
    submission and shows each failing field's message inline if any check fails. 
    Submit via POST /api/forms/${formId}/submit.
  - Excludes any field currently hidden by its visibleWhen rule from the submit 
    payload, even if that field holds a stale value from before it was hidden
  - Uses useFormStatus to show loading state on the submit button. useFormStatus 
    only reports status for a parent <form> -- it must be called inside a separate 
    child component rendered within the form (e.g. a dedicated SubmitButton 
    component), not in the same component that renders the <form> element itself, 
    wired via a real form Action (<form action={...}>), not onSubmit.
  - Uses useOptimistic to show instant success feedback on submit -- rolled back
    with an inline error if the server later rejects it
  - Clean white card layout centered on the page, TailwindCSS v4. All
    text must use dark, high-contrast colors (e.g. text-gray-900)
    against the white card background -- do not carry over light/white
    text styling.

DynamicForm field-type dispatch:
  - Cover every type in the FormConfig schema: text, email, password,
    number, tel, url, textarea, select, multiselect, radio, checkbox, 
    checkbox-group, date, datetime, time, file, slider, rating, hidden.
  - Every rendered <label> has a matching htmlFor pointing at its control's id
    (id={field.name})
  - For select, multiselect, radio, and checkbox-group, map
    field.options into the corresponding <option>/<input> elements –
    a field with no case matched must not render silently empty.
  - A field with type hidden renders only <input type="hidden">, with
    no visible label or layout row -- not a label with an empty input.

Also generate App.tsx with React Router routes:
  / : FormList page (list all available forms)
  /forms/:formId : FormPage

Use React 19 patterns where applicable. No class components.
 
Write all files under packages/web/src/.
Do not create FormList.tsx or a matching hook -- App.tsx should still import and route to it; FormList is generated separately in the next step.
