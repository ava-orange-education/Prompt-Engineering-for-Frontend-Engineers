import type { ReactNode } from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface KpiCardProps {
  title: string
  value: string
  change: number
  icon: ReactNode
  loading?: boolean
}

export function KpiCard({ title, value, change, icon, loading }: KpiCardProps) {
  if (loading) {
    return (
      <div
        data-testid="kpi-card-skeleton"
        className="animate-pulse rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800"
      >
        <div className="mb-4 h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="mb-3 h-8 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-5 w-1/3 rounded bg-gray-200 dark:bg-gray-700" />
      </div>
    )
  }

  const isPositive = change > 0
  const isNeutral = change === 0
  const TrendIcon = isNeutral ? Minus : isPositive ? TrendingUp : TrendingDown
  const badgeClass = isNeutral
    ? 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-300'
    : isPositive
      ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400'
      : 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400'

  return (
    <div
      role="region"
      aria-label={`${title}: ${value}`}
      className="cursor-default rounded-2xl border border-gray-200 bg-white p-6
                 transition-transform duration-200 hover:scale-[1.02] dark:border-gray-700 dark:bg-gray-800"
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400">
          {title}
        </span>
        <span className="text-blue-500 dark:text-blue-400">{icon}</span>
      </div>
      <p className="mb-3 text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
      <span
        className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${badgeClass}`}
      >
        <TrendIcon size={12} />
        {Math.abs(change).toFixed(1)}%
      </span>
    </div>
  )
}
