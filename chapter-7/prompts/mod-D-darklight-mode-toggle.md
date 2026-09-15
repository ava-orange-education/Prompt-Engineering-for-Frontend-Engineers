# Modification Prompt D  —  Dark/Light Mode Toggle

```
Implement a dark/light mode toggle using Tailwind v4 class-based dark mode.

1. Create a useDarkMode hook in src/hooks/useDarkMode.ts that:
   - Reads initial preference from localStorage ('theme') or system preference
   - Adds/removes 'dark' class on document.documentElement
   - Persists preference to localStorage on change
   - Returns { isDark, toggle }
2. Wire the toggle button in DashboardHeader to useDarkMode
3. Update Tailwind classes to support light mode with dark: prefix:
   bg-gray-800 => bg-white dark:bg-gray-800
   text-white  => text-gray-900 dark:text-white
4. In D3 chart components, accept a dark boolean prop and switch between
   '#9CA3AF' (dark) and '#374151' (light) for axis text colour
```
