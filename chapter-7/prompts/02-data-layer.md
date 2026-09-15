# Prompt 2  —  Data Layer

```
Generate the data layer for the NovaMart dashboard in src/types/ and src/data/.

TypeScript interfaces needed (src/types/index.ts):
  - Order: id, date (Date), customerId, customerName, productCategory,
           orderValue, status ('pending'|'fulfilled'|'cancelled')
  - MonthlySales: month (string 'Jan'...'Dec'), revenue, orders
  - CategorySales: category (string), revenue, orderCount
  - CustomerLTV: customerId, orderValue, lifetimeValue, orderCount
  - KpiMetrics: totalRevenue, totalOrders, avgOrderValue,
                retentionRate, revenueChange, ordersChange (% change vs prev period)

Data generators (src/data/generators.ts):
  - generateOrders(n: number): Order[]  — realistic names, categories from
    ['Electronics','Apparel','Home & Garden','Sports','Books'], dates in last 90
    days, order values from $15 to $850 with a right-skewed distribution.
    Draw from a stable pool of ~200 customers (id + name generated once) 
    rather than drawing customerId and customerName independently per
    order, so the same customerId always maps to the same name and
    CustomerLTV/retention calculations are meaningful.
  - deriveMonthlySales / deriveCategorySales / deriveCustomerLTV / deriveKpis

Custom hook (src/hooks/useDashboardData.ts):
  - Generate 500 current-period and 500 previous-period orders
  - Return all datasets, a loading boolean, and a refresh() function
  - Simulate 800ms async loading with setTimeout
  - Use seeded random generation for reproducibility
```
