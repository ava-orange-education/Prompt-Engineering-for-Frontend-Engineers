# Prompt — Pre-Deployment Performance Audit

```
Audit the dashboard for production performance:
  1. Code splitting: wrap each chart component in React.lazy() + Suspense
  2. D3 imports: replace 'import * as d3 from d3' with named imports
     (e.g. import { scaleLinear, axisBottom } from "d3-scale") to reduce bundle
  3. useMemo: wrap expensive derivations in useDashboardData
  4. Add <meta name="viewport"> and <meta name="theme-color"> to index.html
  5. Add a PWA manifest (public/manifest.json) for installability
```
