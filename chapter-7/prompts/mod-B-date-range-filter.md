# Modification Prompt B  —  Date Range Filter

```
Add a date range filter to the dashboard:
  1. Add a DateRangeFilter component in src/components/ui/DateRangeFilter.tsx
     - Two <input type='date'> fields: 'From' and 'To'
     - Styled with bg-gray-700 border-gray-600 text-white
     - Emits onChange(from: Date, to: Date) when either field changes
  2. Modify useDashboardData to accept an optional dateRange
     { from: Date; to: Date } and filter generated orders to that range
  3. Add the DateRangeFilter to DashboardHeader, storing selected range
     in state in Dashboard.tsx and passing it to useDashboardData
Keep all existing prop interfaces intact.
```
