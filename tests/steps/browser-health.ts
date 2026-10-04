import { expect, type Page } from '@playwright/test'
import { createBdd } from 'playwright-bdd'
import { observeBrowserHealth } from '../support/browser-health'

const { Before, After } = createBdd()
const observers = new WeakMap<Page, ReturnType<typeof observeBrowserHealth>>()
Before(async ({ page }) => { observers.set(page, observeBrowserHealth(page)) })
After(async ({ page, $testInfo }) => {
  const observer = observers.get(page)
  if (!observer) throw new Error('Browser health observer was not installed')
  observer.dispose()
  if (observer.failures.length) {
    await $testInfo.attach('browser-health', { body: JSON.stringify(observer.failures, null, 2), contentType: 'application/json' })
  }
  expect(observer.failures, 'No hydration mismatches or uncaught browser errors').toEqual([])
})
