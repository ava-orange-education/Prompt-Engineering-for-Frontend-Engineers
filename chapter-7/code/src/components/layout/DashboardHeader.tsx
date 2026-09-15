import { Moon, RefreshCw, Sun } from 'lucide-react'
import { DateRangeFilter } from '@/components/ui/DateRangeFilter'

interface DashboardHeaderProps {
  onRefresh: () => void
  isDark: boolean
  onToggleDark: () => void
  onDateRangeChange?: (from: Date, to: Date) => void
}

export function DashboardHeader({
  onRefresh,
  isDark,
  onToggleDark,
  onDateRangeChange,
}: DashboardHeaderProps) {
  return (
    <header className="fixed top-0 right-0 left-0 z-10 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 dark:border-gray-700 dark:bg-gray-800 lg:left-16">
      <div className="flex items-center gap-4">
        <span className="text-lg font-bold text-violet-500 dark:text-violet-400">NovaMart</span>
        <span className="text-sm text-gray-500 dark:text-gray-400">Analytics</span>
      </div>
      <div className="flex items-center gap-4">
        {onDateRangeChange && <DateRangeFilter onChange={onDateRangeChange} />}
        <button
          type="button"
          onClick={onToggleDark}
          data-testid="dark-mode-toggle"
          aria-label="Toggle dark mode"
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button
          type="button"
          onClick={onRefresh}
          data-testid="refresh-button"
          aria-label="Refresh dashboard data"
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
        >
          <RefreshCw size={18} />
        </button>
      </div>
    </header>
  )
}
