# Prompt 5  —  D3 Horizontal Bar Chart

```
Create a horizontal bar chart in src/components/charts/CategoryBarChart.tsx.
Props: { data: CategorySales[] }

Requirements:
  - Sort bars by revenue descending before rendering
  - Horizontal layout: category labels on y-axis, revenue bars extending right
  - Bar color: gradient from violet-600 to violet-400 left to right
  - Animated entry: bars grow from 0 width to full width, staggered by 60ms per bar
  - Value label at the right end of each bar showing $Xk
  - Hover: bar brightens to violet-300, cursor pointer
  - Dark card styling matching KpiCard and RevenueAreaChart
  - Responsive via ResizeObserver
```
