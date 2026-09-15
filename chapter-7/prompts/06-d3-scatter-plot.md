# Prompt 6  —  D3 Scatter Plot

```
Create a scatter plot in src/components/charts/LtvScatterPlot.tsx.
Props: { data: CustomerLTV[] }

Requirements:
  - X-axis: orderValue ($15-$850), label 'Order Value'
  - Y-axis: lifetimeValue ($0-$5000+), label 'Lifetime Value'
  - Dots: radius 4, violet-400 fill, 0.6 opacity, stroke violet-300
  - Add a linear regression trend line in amber-400 using the d3-regression
    package (regressionLinear)
  - Tooltip on hover: customerId, orderValue, lifetimeValue, orderCount
  - Animate: dots fade in with stagger, 400ms total
  - Dark card styling, responsive
```
