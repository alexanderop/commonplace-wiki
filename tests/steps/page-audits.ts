import AxeBuilder from '@axe-core/playwright'
import { expect, type Page, type TestInfo } from '@playwright/test'
import { createBdd } from 'playwright-bdd'
import en from '../../apps/wiki/app/i18n/en'
import de from '../../apps/wiki/app/i18n/de'

const { Given, When, Then } = createBdd()
const readers = new WeakMap<Page, { locale: 'de' | 'en'; theme: 'dark' | 'light'; mobile: boolean }>()

async function audit(page: Page, testInfo: TestInfo, state: string) {
  const results = await new AxeBuilder({ page }).analyze()
  await testInfo.attach(`axe-${state}`, { body: JSON.stringify(results, null, 2), contentType: 'application/json' })
  expect(results.violations, `${page.url()} (${state})`).toEqual([])
}

Given('a reader using {string}', async ({ page }, profile: string) => {
  const locale = profile.startsWith('en-') ? 'en' : 'de'
  const theme = profile.includes('-light-') ? 'light' : 'dark'
  const mobile = profile.endsWith('-mobile')
  readers.set(page, { locale, theme, mobile })
  await page.setViewportSize(mobile ? { width: 390, height: 844 } : { width: 1280, height: 900 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  if (profile !== 'fresh-desktop') {
    await page.addInitScript(({ locale, theme }) => {
      localStorage.setItem('commonplace-locale', locale)
      localStorage.setItem('commonplace-theme', theme)
    }, { locale, theme })
  }
})
When('the reader opens the published page {string}', async ({ page }, route: string) => {
  const response = await page.goto(route)
  expect(response?.status()).toBe(200)
  await expect(page.locator('html')).toHaveAttribute('data-hydrated', 'true')
  const reader = readers.get(page)!
  await expect(page.locator('html')).toHaveAttribute('lang', reader.locale)
  await expect(page.locator('html')).toHaveAttribute('data-theme', reader.theme)
  await expect(page.getByRole('main').getByRole('heading', { level: 1 })).toBeVisible()
  // Wait for client-only graphs to mount before auditing their accessible alternatives.
  if (await page.locator('.graph-surface:visible').count()) await expect(page.locator('.graph-surface:visible canvas').first()).toBeVisible()
})
Then('the page has no automatically detectable accessibility violations', async ({ page, $testInfo }) => {
  await audit(page, $testInfo, 'page')
})
Then('its shared controls remain accessible and interactive', async ({ page, $testInfo }) => {
  const reader = readers.get(page)!
  const t = reader.locale === 'en' ? en : de
  if (reader.mobile) {
    await page.getByRole('button', { name: t.menu, exact: true }).click()
    await expect(page.getByRole('navigation', { name: t.notes })).toBeVisible()
    await audit(page, $testInfo, 'mobile-navigation')
  }
  const trigger = page.getByRole('button').filter({ hasText: t.findThoughts })
  await trigger.click()
  await expect(page.getByRole('textbox', { name: t.searchLabel })).toBeFocused()
  await audit(page, $testInfo, 'search')
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).not.toBeVisible()
  await expect(trigger).toBeFocused()
})
