# Prompt 4  —  D3 Revenue Area Chart

```
Create a D3 area chart in src/components/charts/RevenueAreaChart.tsx.
Props: { data: MonthlySales[]; width?: number; height?: number }

Requirements:
  - Use a ref to attach D3 to a React-rendered <svg> inside useEffect
  - Clean up previous D3 render on each effect run (remove all SVG children)
  - Responsive: use ResizeObserver to re-render when container width changes
  - X-axis: month labels, bottom of chart
  - Y-axis: revenue in $k, left side, 5 tick marks
  - Area: filled with a purple-to-transparent vertical gradient (linearGradient)
  - Line: solid violet-500 stroke on top of area
  - Animated entry: line transitions from left to right over 800ms
    using stroke-dasharray / stroke-dashoffset trick
  - Hover tooltip: vertical rule + dot + floating box showing month and revenue
  - Dark background: parent div has bg-gray-800 rounded-2xl p-6
  - Export as named export RevenueAreaChart
```
