Generate Playwright 1.50 E2E tests for FormForge.

Scenarios:
  1. Form list page loads and shows at least two form links
  2. Clicking employee-onboarding navigates to the form
  3. Form title is visible
  4. Submitting empty form shows multiple validation errors
  5. Selecting Contractor hides salary and shows contractEndDate
  6. Completing and submitting with valid data shows success message
  7. Leave Request form loads at /forms/leave-request

Use page.waitForLoadState('networkidle') after navigations.
Each test is independent — always start from the form list page.
File: tests/formforge.spec.ts
