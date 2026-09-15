import type { Order, OrderStatus } from '@/types'

interface OrdersTableProps {
  orders: Order[]
  loading?: boolean
}

const STATUS_STYLES: Record<OrderStatus, string> = {
  fulfilled: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400',
  pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-400',
  cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400',
}

const SKELETON_ROWS = Array.from({ length: 6 })

export function OrdersTable({ orders, loading }: OrdersTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
        Recent Orders
      </h3>
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-xs tracking-wider text-gray-500 uppercase dark:border-gray-700 dark:text-gray-400">
            <th className="pb-3 pr-4 font-semibold">Order ID</th>
            <th className="pb-3 pr-4 font-semibold">Customer</th>
            <th className="pb-3 pr-4 font-semibold">Category</th>
            <th className="pb-3 pr-4 font-semibold">Date</th>
            <th className="pb-3 pr-4 font-semibold">Amount</th>
            <th className="pb-3 font-semibold">Status</th>
          </tr>
        </thead>
        <tbody>
          {loading
            ? SKELETON_ROWS.map((_, i) => (
                <tr key={i} className="animate-pulse border-b border-gray-200/50 dark:border-gray-700/50">
                  {Array.from({ length: 6 }).map((__, j) => (
                    <td key={j} className="py-3 pr-4">
                      <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
                    </td>
                  ))}
                </tr>
              ))
            : orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-gray-200/50 text-gray-700 dark:border-gray-700/50 dark:text-gray-200"
                >
                  <td className="py-3 pr-4 font-mono text-xs text-gray-500 dark:text-gray-400">
                    {order.id}
                  </td>
                  <td className="py-3 pr-4">{order.customerName}</td>
                  <td className="py-3 pr-4">{order.productCategory}</td>
                  <td className="py-3 pr-4 text-gray-500 dark:text-gray-400">
                    {order.date.toLocaleDateString()}
                  </td>
                  <td className="py-3 pr-4 font-medium">${order.orderValue.toLocaleString()}</td>
                  <td className="py-3">
                    <span
                      className={`inline-block rounded-full px-2 py-1 text-xs font-semibold capitalize ${STATUS_STYLES[order.status]}`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  )
}
