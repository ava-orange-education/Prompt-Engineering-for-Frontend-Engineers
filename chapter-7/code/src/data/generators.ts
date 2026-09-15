import type {
  Order,
  MonthlySales,
  CategorySales,
  CustomerLTV,
  KpiMetrics,
  OrderStatus,
} from '@/types'

const CATEGORIES = ['Electronics', 'Apparel', 'Home & Garden', 'Sports', 'Books']

const FIRST_NAMES = [
  'Alice', 'Bob', 'Carol', 'Dan', 'Eve', 'Frank', 'Grace', 'Henry',
  'Ivy', 'Jack', 'Karen', 'Liam', 'Mia', 'Noah', 'Olivia', 'Paul',
]

const LAST_NAMES = [
  'Smith', 'Jones', 'Lee', 'Kim', 'Patel', 'Brown', 'Davis', 'Anderson',
  'Wilson', 'Taylor', 'Moore', 'Clark', 'Lewis', 'Walker', 'Young',
]

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

const CUSTOMER_POOL_SIZE = 200

/** Simple seeded linear congruential generator for reproducible pseudo-randomness. */
function makeRng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 0xffffffff
  }
}

interface Customer {
  id: string
  name: string
}

function makeCustomerPool(rng: () => number): Customer[] {
  return Array.from({ length: CUSTOMER_POOL_SIZE }, (_, i) => {
    const first = FIRST_NAMES[Math.floor(rng() * FIRST_NAMES.length)]
    const last = LAST_NAMES[Math.floor(rng() * LAST_NAMES.length)]
    return {
      id: `CUST-${String(i).padStart(4, '0')}`,
      name: `${first} ${last}`,
    }
  })
}

/**
 * Generates n synthetic orders drawn from a stable customer pool, so the same
 * customerId always maps to the same customerName across the generated set.
 */
export function generateOrders(n: number, seed = 42): Order[] {
  const rng = makeRng(seed)
  const now = new Date()
  const customers = makeCustomerPool(rng)

  return Array.from({ length: n }, (_, i) => {
    const daysAgo = Math.floor(rng() * 90)
    const date = new Date(now)
    date.setDate(date.getDate() - daysAgo)

    // Right-skewed distribution: squaring the uniform draw biases toward
    // the lower end of the $15-$850 range, with an occasional high outlier.
    const u = rng()
    const orderValue = Math.round(15 + u * u * 835)

    const customer = customers[Math.floor(rng() * customers.length)]
    const statusRoll = rng()
    const status: OrderStatus =
      statusRoll < 0.7 ? 'fulfilled' : statusRoll < 0.85 ? 'pending' : 'cancelled'

    return {
      id: `ORD-${String(i + 1).padStart(5, '0')}`,
      date,
      customerId: customer.id,
      customerName: customer.name,
      productCategory: CATEGORIES[Math.floor(rng() * CATEGORIES.length)],
      orderValue,
      status,
    }
  })
}

export function deriveMonthlySales(orders: Order[]): MonthlySales[] {
  const totals = new Map<string, { revenue: number; orders: number }>()

  orders.forEach((order) => {
    const month = MONTHS[order.date.getMonth()]
    const current = totals.get(month) ?? { revenue: 0, orders: 0 }
    totals.set(month, {
      revenue: current.revenue + order.orderValue,
      orders: current.orders + 1,
    })
  })

  return MONTHS.filter((month) => totals.has(month)).map((month) => ({
    month,
    ...totals.get(month)!,
  }))
}

export function deriveCategorySales(orders: Order[]): CategorySales[] {
  const totals = new Map<string, { revenue: number; orderCount: number }>()

  orders.forEach((order) => {
    const current = totals.get(order.productCategory) ?? { revenue: 0, orderCount: 0 }
    totals.set(order.productCategory, {
      revenue: current.revenue + order.orderValue,
      orderCount: current.orderCount + 1,
    })
  })

  return Array.from(totals.entries()).map(([category, values]) => ({
    category,
    ...values,
  }))
}

export function deriveCustomerLTV(orders: Order[]): CustomerLTV[] {
  const totals = new Map<string, { lifetimeValue: number; orderCount: number }>()

  orders.forEach((order) => {
    const current = totals.get(order.customerId) ?? { lifetimeValue: 0, orderCount: 0 }
    totals.set(order.customerId, {
      lifetimeValue: current.lifetimeValue + order.orderValue,
      orderCount: current.orderCount + 1,
    })
  })

  // orderValue in the returned point represents this customer's average
  // order value, plotted against their cumulative lifetime value.
  return Array.from(totals.entries()).map(([customerId, values]) => ({
    customerId,
    orderValue: Math.round(values.lifetimeValue / values.orderCount),
    lifetimeValue: values.lifetimeValue,
    orderCount: values.orderCount,
  }))
}

function percentChange(current: number, previous: number): number {
  if (previous === 0) return 0
  return ((current - previous) / previous) * 100
}

export function deriveKpis(current: Order[], previous: Order[]): KpiMetrics {
  const totalRevenue = current.reduce((sum, o) => sum + o.orderValue, 0)
  const totalOrders = current.length
  const avgOrderValue = totalOrders === 0 ? 0 : totalRevenue / totalOrders

  const prevRevenue = previous.reduce((sum, o) => sum + o.orderValue, 0)

  const currentCustomers = new Set(current.map((o) => o.customerId))
  const previousCustomers = new Set(previous.map((o) => o.customerId))
  const returning = [...currentCustomers].filter((id) => previousCustomers.has(id))
  const retentionRate =
    currentCustomers.size === 0 ? 0 : (returning.length / currentCustomers.size) * 100

  return {
    totalRevenue,
    totalOrders,
    avgOrderValue,
    retentionRate,
    revenueChange: percentChange(totalRevenue, prevRevenue),
    ordersChange: percentChange(totalOrders, previous.length),
  }
}
