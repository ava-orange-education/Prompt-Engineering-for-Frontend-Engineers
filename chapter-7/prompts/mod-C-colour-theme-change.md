# Modification Prompt C  —  Colour Theme Change

```
Change the dashboard colour theme from violet/purple to blue throughout.
Replacements:
  - violet-400/500/600 => blue-400/500/600
  - violet-300 => blue-300
  - purple-xxx => blue-xxx
  - #8B5CF6 (violet-500) => #3B82F6 (blue-500)
  - #7C3AED (violet-600) => #2563EB (blue-600)
  - #A78BFA (violet-400) => #60A5FA (blue-400)
  - #C4B5FD (violet-300) => #93C5FD (blue-300)

Update: KpiCard.tsx, RevenueAreaChart.tsx, CategoryBarChart.tsx,
        LtvScatterPlot.tsx, Sidebar.tsx, and src/app.css @theme block.

Providing explicit hex mappings alongside Tailwind class names is essential
because D3 components use hardcoded hex values while Tailwind uses utility classes.
```
