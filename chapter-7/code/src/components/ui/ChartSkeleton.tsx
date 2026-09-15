const BAR_HEIGHTS = ['h-16', 'h-28', 'h-20', 'h-32', 'h-24', 'h-12']

export function ChartSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-4 h-4 w-1/3 rounded bg-gray-200 dark:bg-gray-700" />
      <div className="flex h-[280px] items-end gap-3">
        {BAR_HEIGHTS.map((h, i) => (
          <div key={i} className={`w-full rounded bg-gray-200 dark:bg-gray-700 ${h}`} />
        ))}
      </div>
    </div>
  )
}
