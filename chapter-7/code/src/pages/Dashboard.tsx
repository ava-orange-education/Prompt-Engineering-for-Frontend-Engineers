import { lazy, Suspense, useState } from 'react'
import { DollarSign, ShoppingCart, Receipt, Users } from 'lucide-react'
import { KpiCard } from '@/components/ui/KpiCard'
import { OrdersTable } from '@/components/ui/OrdersTable'
import { ChartSkeleton } from '@/components/ui/ChartSkeleton'
import { DashboardHeader } from '@/components/layout/DashboardHeader'
import { Sidebar } from '@/components/layout/Sidebar'
import { useDashboardData, type DateRange } from '@/hooks/useDashboardData'
import { useDarkMode } from '@/hooks/useDarkMode'

const RevenueAreaChart = lazy(() =>
  import('@/components/charts/RevenueAreaChart').then((m) => ({ default: m.RevenueAreaChart })),
)
const CategoryBarChart = lazy(() =>
  import('@/components/charts/CategoryBarChart').then((m) => ({ default: m.CategoryBarChart })),
)
const LtvScatterPlot = lazy(() =>
  import('@/components/charts/LtvScatterPlot').then((m) => ({ default: m.LtvScatterPlot })),
)

export function Dashboard() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)
  const { orders, monthlySales, categorySales, customerLtv, kpis, loading, refresh } =
    useDashboardData(dateRange)
  const { isDark, toggle } = useDarkMode()

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <Sidebar />
      <DashboardHeader
        onRefresh={refresh}
        isDark={isDark}
        onToggleDark={toggle}
        onDateRangeChange={(from, to) => setDateRange({ from, to })}
      />

      <main className="px-6 pt-24 pb-10 lg:pl-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard
            title="Total Revenue"
            value={`$${kpis.totalRevenue.toLocaleString()}`}
            change={kpis.revenueChange}
            icon={<DollarSign size={20} />}
            loading={loading}
          />
          <KpiCard
            title="Total Orders"
            value={kpis.totalOrders.toLocaleString()}
            change={kpis.ordersChange}
            icon={<ShoppingCart size={20} />}
            loading={loading}
          />
          <KpiCard
            title="Avg Order Value"
            value={`$${kpis.avgOrderValue.toFixed(2)}`}
            change={kpis.revenueChange - kpis.ordersChange}
            icon={<Receipt size={20} />}
            loading={loading}
          />
          <KpiCard
            title="Retention Rate"
            value={`${kpis.retentionRate.toFixed(1)}%`}
            change={0}
            icon={<Users size={20} />}
            loading={loading}
          />
        </div>

        <div className="mx-auto mt-6 grid max-w-7xl grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <Suspense fallback={<ChartSkeleton />}>
              <RevenueAreaChart data={monthlySales} dark={isDark} />
            </Suspense>
          </div>
          <Suspense fallback={<ChartSkeleton />}>
            <CategoryBarChart data={categorySales} dark={isDark} />
          </Suspense>
        </div>

        <div className="mx-auto mt-6 grid max-w-7xl grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <Suspense fallback={<ChartSkeleton />}>
              <LtvScatterPlot data={customerLtv} dark={isDark} />
            </Suspense>
          </div>
          <div className="xl:col-span-1" />
        </div>

        <div className="mx-auto mt-6 max-w-7xl">
          <OrdersTable orders={orders.slice(0, 10)} loading={loading} />
        </div>
      </main>
    </div>
  )
}
