import { expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { createBdd } from 'playwright-bdd'
const { Then } = createBdd()
Then('the language menu supports keyboard selection and dismissal', async ({ page }) => {
  const menu = page.getByRole('button', { name: 'Menu ☰', exact: true })
  if (await menu.isVisible()) await menu.click()
  const trigger = page.getByRole('combobox', { name: 'Sprache / Language' })
  await trigger.focus()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('option', { name: 'English', exact: true })).toBeFocused()
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
  await page.keyboard.press('Escape')
  await expect(page.getByRole('listbox')).not.toBeVisible()
  await expect(trigger).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('option', { name: 'English', exact: true })).toBeFocused()
  await page.keyboard.press('Home')
  await expect(page.getByRole('option', { name: 'Deutsch', exact: true })).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(trigger).toHaveText('Deutsch')
  await expect(page.locator('html')).toHaveAttribute('lang', 'de')
  await expect(trigger).toBeFocused()
})
