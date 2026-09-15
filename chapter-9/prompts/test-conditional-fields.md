Generate React Testing Library tests for conditional field behavior.
Import the actual employee-onboarding.json config and pass it to DynamicForm.

Scenarios:
  1. Salary field is visible by default on initial render (before any Employment Type is chosen) -- the neq operator means it's hidden only once Contractor is explicitly selected, not hidden until a choice is made
  2. Salary field appears when Full-time is selected
  3. Salary field disappears when Contractor is selected
  4. contractEndDate appears when Contractor is selected
  5. partTimeHours appears when Part-time is selected
  6. Submitting with Contractor selected and no contractEndDate
     shows a required validation error

File: packages/web/src/components/DynamicForm.test.tsx
Use @testing-library/user-event v14.
