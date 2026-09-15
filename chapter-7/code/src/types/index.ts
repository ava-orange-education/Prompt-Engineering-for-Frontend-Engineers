export type OrderStatus = 'pending' | 'fulfilled' | 'cancelled'

export interface Order {
  id: string
  date: Date
  customerId: string
  customerName: string
  productCategory: string
  orderValue: number
  status: OrderStatus
}

export interface MonthlySales {
  month: string
  revenue: number
  orders: number
}

export interface CategorySales {
  category: string
  revenue: number
  orderCount: number
}

export interface CustomerLTV {
  customerId: string
  orderValue: number
  lifetimeValue: number
  orderCount: number
}

export interface KpiMetrics {
  totalRevenue: number
  totalOrders: number
  avgOrderValue: number
  retentionRate: number
  revenueChange: number
  ordersChange: number
}
