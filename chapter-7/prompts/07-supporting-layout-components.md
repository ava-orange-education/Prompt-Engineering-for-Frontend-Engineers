# Prompt 7a — Supporting Layout Components

```
Before assembling the full dashboard page, generate the layout and
supporting components it depends on.

DashboardHeader (src/components/layout/DashboardHeader.tsx):
- Props: onRefresh, isDark, onToggleDark
- Fixed top bar: NovaMart logo (violet text), page title "Analytics"
- Dark mode toggle (data-testid="dark-mode-toggle") and refresh button
- The toggle is wired to real state in Modification D; for now it
  renders and is clickable but has no persistent effect

Sidebar (src/components/layout/Sidebar.tsx):
- Fixed left sidebar, 64px wide, icon-only navigation
- Nav items: Dashboard (active, violet), Reports, Users, Settings
- data-testid="sidebar"; hidden below the lg breakpoint

ChartSkeleton (src/components/ui/ChartSkeleton.tsx):
- No props; dark card styling matching the real charts
- animate-pulse bars simulating a chart's rough shape

OrdersTable (src/components/ui/OrdersTable.tsx):
- Props: orders, loading?
- Order ID, customer, category, date, amount, coloured status badge
- Skeleton rows while loading
```
