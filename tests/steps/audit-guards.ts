import AxeBuilder from '@axe-core/playwright'
import { expect } from '@playwright/test'
import { createBdd } from 'playwright-bdd'
import { observeBrowserHealth } from '../support/browser-health'

const { Then } = createBdd()
Then('the accessibility auditor rejects a button without a name', async ({ page }) => {
  await page.setContent('<html lang="en"><head><title>Audit canary</title></head><body><main><h1>Canary</h1><button></button></main></body></html>')
  const result = await new AxeBuilder({ page }).analyze()
  expect(result.violations.some(violation => violation.id === 'button-name')).toBe(true)
})
Then('the hydration observer detects deliberately changed server HTML', async ({ context, baseURL }) => {
  // A separate page isolates the intentional error from the global health gate.
  const page = await context.newPage()
  const observer = observeBrowserHealth(page)
  try {
    await page.route(baseURL!, async route => {
      const response = await route.fetch()
      const html = await response.text()
      const body = html.replace(/(<h1\b[^>]*>)/, '$1Deliberate server mismatch ')
      expect(body).not.toBe(html)
      await route.fulfill({ response, body })
    })
    await page.goto(baseURL!)
    await expect(page.locator('html')).toHaveAttribute('data-hydrated', 'true')
    await expect.poll(() => observer.failures.filter(item => item.kind === 'hydration').length).toBeGreaterThan(0)
  } finally {
    observer.dispose()
    await page.close()
  }
})
Then('the hydration observer captures warning and error messages', async ({ context }) => {
  const page = await context.newPage()
  const observer = observeBrowserHealth(page)
  try {
    await page.evaluate(() => {
      console.warn('[Vue warn]: Hydration attribute mismatch')
      console.error('Hydration completed but contains mismatches.')
      console.log('An unrelated diagnostic')
    })
    await expect.poll(() => observer.failures.length).toBe(2)
    expect(observer.failures.every(item => item.kind === 'hydration')).toBe(true)
  } finally {
    observer.dispose()
    await page.close()
  }
})
