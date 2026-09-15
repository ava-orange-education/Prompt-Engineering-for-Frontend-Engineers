# Prompt — Unit Tests for Data Layer

```
Generate Vitest unit tests in src/data/generators.test.ts
for all functions in src/data/generators.ts.

Tests to write:
  generateOrders(n):
    - Returns exactly n orders
    - All orders have valid status values
    - All orderValues are between 15 and 850
    - Dates are within the last 90 days
    - Same seed produces identical output (reproducibility)

  deriveMonthlySales(orders):
    - Returns at most 12 entries
    - Sum of all revenues equals sum of order values
    - Each entry has a valid month string

  deriveKpis(current, previous):
    - revenueChange is correct: (curRev - prevRev) / prevRev * 100
    - Handles zero previous revenue without dividing by zero

Use describe/it blocks. Aim for 100% branch coverage.
```
