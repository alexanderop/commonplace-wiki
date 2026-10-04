import { readdir, readFile } from 'node:fs/promises'
import { expect } from '@playwright/test'
import { createBdd } from 'playwright-bdd'
import en from '../../apps/wiki/app/i18n/en'

const { Given, When, Then } = createBdd()
Given('a screen width of {int} pixels', async ({ page }, width: number) => {
  await page.setViewportSize({ width, height: 844 })
})
Then('search is directly available without opening navigation', async ({ page }) => {
  const search = page.getByRole('button').filter({ hasText: en.findThoughts })
  await expect(search).toBeInViewport()
  await search.click()
  await expect(page.getByRole('textbox', { name: en.searchLabel })).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(search).toBeFocused()
})
Then('the home preview graph is not mounted', async ({ page }) => {
  await expect(page.locator('.hero-graph canvas')).toHaveCount(0)
})
Then('mobile actions have comfortable touch targets', async ({ page }) => {
  for (const button of [page.getByRole('button', { name: en.menu, exact: true }), page.getByRole('button', { name: en.lightTheme }), page.getByRole('button').filter({ hasText: en.findThoughts })]) {
    const bounds = await button.boundingBox()
    expect(bounds?.width).toBeGreaterThanOrEqual(44)
    expect(bounds?.height).toBeGreaterThanOrEqual(44)
  }
})
When('I open mobile navigation with the keyboard', async ({ page }) => {
  const trigger = page.getByRole('button', { name: en.menu, exact: true })
  await trigger.focus()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('dialog', { name: en.yourLibrary })).toBeVisible()
})
Then('navigation keeps focus inside until Escape returns it', async ({ page }) => {
  const dialog = page.getByRole('dialog', { name: en.yourLibrary })
  const links = dialog.getByRole('link')
  await links.last().focus()
  for (let index = 0; index < 4; index++) {
    await page.keyboard.press('Tab')
    await expect.poll(() => dialog.evaluate(element => element.contains(document.activeElement))).toBe(true)
  }
  await page.keyboard.press('Escape')
  await expect(dialog).not.toBeVisible()
  await expect(page.getByRole('button', { name: en.menu, exact: true })).toBeFocused()
})
When('the screen becomes desktop width', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 })
})
Then('desktop navigation is usable without a modal', async ({ page }) => {
  await expect(page.getByRole('dialog')).not.toBeVisible()
  await expect(page.locator('.desktop-sidebar').getByRole('link').first()).toBeFocused()
  await page.locator('.desktop-sidebar').getByRole('link').first().click()
  await expect(page.getByRole('heading', { name: en.inLibrary })).toBeVisible()
})
When('I read the available notes on a narrow screen', async ({ page }) => {
  const files = (await readdir('apps/wiki/.generated/public')).filter(file => file.endsWith('.json'))
  for (const file of files) {
    const note = JSON.parse(await readFile(`apps/wiki/.generated/public/${file}`, 'utf8'))
    await page.goto(`./notes/${note.noteId}`)
    await expect(page.locator('html')).toHaveAttribute('data-hydrated', 'true')
    await expect(page.getByRole('article')).toBeVisible()
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), note.noteId).toBe(true)
    for (const button of await page.locator('.share-actions button').all()) {
      expect((await button.boundingBox())?.height).toBeGreaterThanOrEqual(44)
    }
  }
  if (!files.length) await page.goto('./')
})
Then('every note fits without horizontal page scrolling', async ({ page }) => {
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
})
