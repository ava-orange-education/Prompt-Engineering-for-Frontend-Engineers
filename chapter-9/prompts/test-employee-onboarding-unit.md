Generate Vitest 4.1 unit tests validating employee-onboarding.json
against its expected shape and business rules directly -- no additional schema library needed at this layer, since the config was already schema-validated by validate-config.ts when it was generated.

Tests to include:
  1. Config has exactly 4 sections with correct IDs
  2. Every field has a unique name within the form
  3. All option-type fields have >= 2 options
  4. All expected required fields are marked required
  5. Phone regex passes valid E.164 and rejects invalid numbers
  6. Salary field has visibleWhen.operator === 'neq'
  7. contractEndDate has visibleWhen.operator === 'eq'

File: packages/api/test/employee-onboarding-config.spec.ts
Use describe/it/expect. No external test helpers beyond vitest.
