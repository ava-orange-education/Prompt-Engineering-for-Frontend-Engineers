# Prompt 3  —  KPI Card Component

```
Create a reusable KpiCard component in src/components/ui/KpiCard.tsx.

Props:
  title:    string
  value:    string            // pre-formatted by caller
  change:   number            // percentage change vs prior period
  icon:     React.ReactNode
  loading?: boolean

Design:
  - Dark card: bg-gray-800 border border-gray-700 rounded-2xl p-6
  - Title: small uppercase gray label
  - Value: large white bold number (text-3xl)
  - Change badge: green (positive) or red (negative) pill with arrow icon
  - Loading state: skeleton shimmer animation using Tailwind animate-pulse
  - Hover: slight scale up (hover:scale-[1.02]) with transition
  - Fully accessible: role=region, aria-label combining title and value
```
