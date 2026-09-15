import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  generateOrders,
  deriveMonthlySales,
  deriveCategorySales,
  deriveCustomerLTV,
  deriveKpis,
} from '@/data/generators'
import type { Order } from '@/types'

const CURRENT_PERIOD_SEED = 42
const PREVIOUS_PERIOD_SEED = 7
const LOADING_DELAY_MS = 800
const ORDERS_PER_PERIOD = 500

export interface DateRange {
  from: Date
  to: Date
}

function inRange(order: Order, range?: DateRange): boolean {
  if (!range) return true
  return order.date >= range.from && order.date <= range.to
}

export function useDashboardData(dateRange?: DateRange) {
  const [loading, setLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)
  const [currentOrders, setCurrentOrders] = useState<Order[]>([])
  const [previousOrders, setPreviousOrders] = useState<Order[]>([])

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentOrders(generateOrders(ORDERS_PER_PERIOD, CURRENT_PERIOD_SEED + refreshKey))
      setPreviousOrders(generateOrders(ORDERS_PER_PERIOD, PREVIOUS_PERIOD_SEED + refreshKey))
      setLoading(false)
    }, LOADING_DELAY_MS)

    return () => clearTimeout(timer)
  }, [refreshKey])

  const filteredCurrentOrders = useMemo(
    () => currentOrders.filter((order) => inRange(order, dateRange)),
    [currentOrders, dateRange],
  )

  const filteredPreviousOrders = useMemo(
    () => previousOrders.filter((order) => inRange(order, dateRange)),
    [previousOrders, dateRange],
  )

  const monthlySales = useMemo(
    () => deriveMonthlySales(filteredCurrentOrders),
    [filteredCurrentOrders],
  )

  const categorySales = useMemo(
    () => deriveCategorySales(filteredCurrentOrders),
    [filteredCurrentOrders],
  )

  const customerLtv = useMemo(
    () => deriveCustomerLTV(filteredCurrentOrders),
    [filteredCurrentOrders],
  )

  const kpis = useMemo(
    () => deriveKpis(filteredCurrentOrders, filteredPreviousOrders),
    [filteredCurrentOrders, filteredPreviousOrders],
  )

  const refresh = useCallback(() => {
    setLoading(true)
    setRefreshKey((key) => key + 1)
  }, [])

  return {
    orders: filteredCurrentOrders,
    monthlySales,
    categorySales,
    customerLtv,
    kpis,
    loading,
    refresh,
  }
}
