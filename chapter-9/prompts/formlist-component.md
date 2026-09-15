Generate the FormList React 19 component for the FormForge application.
 
Behavior:
  - Fetches the list of available forms from GET /api/forms (returns an
    array of { formId: string; title: string; description?: string })
  - All fetch calls use relative paths (/api/...), never an absolute localhost 
    origin
  - Shows a loading skeleton while fetching
  - Shows a friendly error state if the fetch fails, with a retry button
  - Renders each form as a card with its title and description, linking
    to /forms/:formId via React Router's Link
  - Shows an empty state ("No forms available yet") if the array is empty
  - Clean white card layout consistent with FormPage, TailwindCSS v4
 
Use React 19 patterns where applicable. No class components.
