import { describe, it, expect } from 'vitest'
import { generateOrders, deriveMonthlySales, deriveKpis } from './generators'
import type { Order } from '@/types'

const STATUSES = new Set(['pending', 'fulfilled', 'cancelled'])
const NINETY_DAYS_MS = 90 * 24 * 60 * 60 * 1000

describe('generateOrders', () => {
  it('returns exactly n orders', () => {
    expect(generateOrders(1).length).toBe(1)
    expect(generateOrders(100).length).toBe(100)
    expect(generateOrders(500).length).toBe(500)
  })

  it('all orders have valid status values', () => {
    generateOrders(200).forEach((order) => {
      expect(STATUSES.has(order.status)).toBe(true)
    })
  })

  it('all orderValues are between 15 and 850', () => {
    generateOrders(500).forEach((order) => {
      expect(order.orderValue).toBeGreaterThanOrEqual(15)
      expect(order.orderValue).toBeLessThanOrEqual(850)
    })
  })

  it('dates are within the last 90 days', () => {
    const now = Date.now()
    generateOrders(200).forEach((order) => {
      expect(order.date.getTime()).toBeLessThanOrEqual(now)
      expect(now - order.date.getTime()).toBeLessThanOrEqual(NINETY_DAYS_MS)
    })
  })

  it('produces identical output for the same seed', () => {
    const a = generateOrders(50, 42)
    const b = generateOrders(50, 42)
    expect(a.map((o) => o.orderValue)).toEqual(b.map((o) => o.orderValue))
    expect(a.map((o) => o.customerId)).toEqual(b.map((o) => o.customerId))
    expect(a.map((o) => o.status)).toEqual(b.map((o) => o.status))
  })

  it('produces different output for different seeds', () => {
    const a = generateOrders(50, 1)
    const b = generateOrders(50, 2)
    expect(a.map((o) => o.orderValue)).not.toEqual(b.map((o) => o.orderValue))
  })

  it('the same customerId always maps to the same customerName', () => {
    const orders = generateOrders(500)
    const nameById = new Map<string, string>()
    orders.forEach((order) => {
      const existing = nameById.get(order.customerId)
      if (existing) {
        expect(order.customerName).toBe(existing)
      } else {
        nameById.set(order.customerId, order.customerName)
      }
    })
  })
})

describe('deriveMonthlySales', () => {
  it('returns at most 12 entries', () => {
    const result = deriveMonthlySales(generateOrders(500))
    expect(result.length).toBeLessThanOrEqual(12)
  })

  it('returns an empty array for no orders', () => {
    expect(deriveMonthlySales([])).toEqual([])
  })

  it('sum of all revenues equals sum of order values', () => {
    const orders = generateOrders(300)
    const result = deriveMonthlySales(orders)
    const totalFromMonths = result.reduce((sum, m) => sum + m.revenue, 0)
    const totalFromOrders = orders.reduce((sum, o) => sum + o.orderValue, 0)
    expect(totalFromMonths).toBe(totalFromOrders)
  })

  it('each entry has a valid month string', () => {
    const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    deriveMonthlySales(generateOrders(200)).forEach((entry) => {
      expect(MONTHS).toContain(entry.month)
    })
  })
})

describe('deriveKpis', () => {
  it('calculates revenueChange correctly', () => {
    const cur = [{ orderValue: 150 }, { orderValue: 50 }] as Order[]
    const prev = [{ orderValue: 100 }, { orderValue: 100 }] as Order[]
    const kpis = deriveKpis(cur, prev)
    expect(kpis.revenueChange).toBeCloseTo(0, 1)
  })

  it('calculates a positive revenueChange when revenue increases', () => {
    const cur = [{ orderValue: 200 }] as Order[]
    const prev = [{ orderValue: 100 }] as Order[]
    const kpis = deriveKpis(cur, prev)
    expect(kpis.revenueChange).toBeCloseTo(100, 1)
  })

  it('handles zero previous revenue without dividing by zero', () => {
    const kpis = deriveKpis([{ orderValue: 100 }] as Order[], [])
    expect(kpis.revenueChange).toBe(0)
    expect(Number.isFinite(kpis.revenueChange)).toBe(true)
  })

  it('handles zero previous orders for ordersChange without dividing by zero', () => {
    const kpis = deriveKpis([{ orderValue: 100 }] as Order[], [])
    expect(kpis.ordersChange).toBe(0)
    expect(Number.isFinite(kpis.ordersChange)).toBe(true)
  })

  it('returns zeroed metrics when current has no orders', () => {
    const kpis = deriveKpis([], [{ orderValue: 100 }] as Order[])
    expect(kpis.totalRevenue).toBe(0)
    expect(kpis.totalOrders).toBe(0)
    expect(kpis.avgOrderValue).toBe(0)
    expect(kpis.retentionRate).toBe(0)
  })
})
