import { test, expect } from '@playwright/test'

test.describe('NovaMart Dashboard', () => {
  test('page load: dashboard loads within 3 seconds, all 4 KPI cards visible', async ({
    page,
  }) => {
    await page.goto('/')
    await page.waitForSelector('[role="region"]', { timeout: 3000 })
    const cards = page.locator('[role="region"]')
    await expect(cards).toHaveCount(4)
    for (const card of await cards.all()) {
      await expect(card).toBeVisible()
    }
  })

  test('loading state: skeleton elements visible during the loading window', async ({
    page,
  }) => {
    await page.goto('/')
    const skeletons = page.locator('[data-testid="kpi-card-skeleton"]')
    await expect(skeletons.first()).toBeVisible()
    await expect(skeletons).toHaveCount(4)
  })

  test('charts render: SVG elements present for all three charts', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('[role="region"]', { timeout: 3000 })
    await expect(page.locator('[data-testid="chart-svg"]')).toHaveCount(3, { timeout: 3000 })
  })

  test('orders table: at least 5 rows visible after load', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('tbody tr', { timeout: 3000 })
    const rows = page.locator('tbody tr')
    await expect(rows).not.toHaveCount(0)
    expect(await rows.count()).toBeGreaterThanOrEqual(5)
  })

  test('refresh button: clicking refresh shows loading state then data', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('[role="region"]', { timeout: 3000 })

    await page.locator('[data-testid="refresh-button"]').click()
    await expect(page.locator('[data-testid="kpi-card-skeleton"]').first()).toBeVisible()

    await page.waitForSelector('[role="region"]', { timeout: 3000 })
    await expect(page.locator('[role="region"]')).toHaveCount(4)
  })

  test('responsive: at 375px viewport, sidebar hidden, KPI cards single column', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')
    await expect(page.locator('[data-testid="sidebar"]')).toBeHidden()

    await page.waitForSelector('[role="region"]', { timeout: 3000 })
    const cards = page.locator('[role="region"]')
    const first = await cards.nth(0).boundingBox()
    const second = await cards.nth(1).boundingBox()
    expect(first).not.toBeNull()
    expect(second).not.toBeNull()
    // Single column layout: second card sits below, not beside, the first.
    expect(second!.y).toBeGreaterThan(first!.y + first!.height / 2)
  })

  test('dark mode toggle: clicking toggle adds "dark" class to <html>', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('[role="region"]', { timeout: 3000 })
    await page.locator('[data-testid="dark-mode-toggle"]').click()
    await expect(page.locator('html')).toHaveClass(/dark/)
  })
})
