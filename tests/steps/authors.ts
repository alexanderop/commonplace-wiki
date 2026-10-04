import { readdir, readFile } from 'node:fs/promises'
import { expect } from '@playwright/test'
import { createBdd } from 'playwright-bdd'
import { contributorsFor, compiledNoteSchema } from '../../apps/wiki/shared/wiki'
import en from '../../apps/wiki/app/i18n/en'

const { When, Then } = createBdd()
async function sources() {
  const files = (await readdir('apps/wiki/.generated/public')).filter(file => file.endsWith('.json'))
  return (await Promise.all(files.map(async file => compiledNoteSchema.parse(JSON.parse(await readFile(`apps/wiki/.generated/public/${file}`, 'utf8')))))).filter(note => note.kind === 'source' && contributorsFor(note).length)
}
When('I browse authors from the library', async ({ page }) => {
  await page.getByRole('link', { name: en.authors, exact: true }).click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(en.authors)
})
Then('author pages contain exactly their published resources', async ({ page }) => {
  const notes = await sources()
  const ids = [...new Set(notes.flatMap(note => contributorsFor(note).map(credit => credit.id)))]
  await expect(page.locator('.author-list li')).toHaveCount(ids.length)
  if (!ids.length) await expect(page.getByRole('status').filter({ hasText: en.noAuthors })).toBeVisible()
  for (const id of ids) {
    const expected = notes.filter(note => contributorsFor(note).some(credit => credit.id === id))
    await page.locator(`.author-list a[href$="/authors/${id}"]`).click()
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(contributorsFor(expected[0]!).find(credit => credit.id === id)!.name)
    await expect(page.locator('.note-card')).toHaveCount(expected.length)
    for (const note of expected) await expect(page.locator('.note-card').getByRole('heading', { name: note.title, exact: true })).toBeVisible()
    const href = await page.locator('.note-card').first().getAttribute('href')
    const selectedNote = expected.find(note => href?.endsWith(`/notes/${note.noteId}`))!
    await page.locator('.note-card').first().click()
    await expect(page.getByRole('article').getByRole('heading', { level: 1 })).toHaveText(selectedNote.title)
    for (const credit of contributorsFor(selectedNote)) {
      const link = page.locator(`.author-link[href$="/authors/${credit.id}"]`)
      await expect(link).toContainText(credit.name)
      for (const role of credit.roles) await expect(link).toContainText(en[`credit_${role}`])
    }
    await page.locator(`.author-link[href$="/authors/${id}"]`).click()
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(contributorsFor(expected[0]!).find(credit => credit.id === id)!.name)
    await page.locator('main').getByRole('link', { name: en.authors }).click()
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(en.authors)
  }
})
Then('the author catalog remains available offline', async ({ page }) => {
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(en.authors)
  const links = page.locator('.author-list a')
  if (await links.count()) {
    await links.first().click()
    await expect(page.locator('.author-resources')).toBeVisible()
    await page.reload()
    await expect(page.locator('.author-resources')).toBeVisible()
  }
})
When('I open an unknown author', async ({ page }) => {
  const response = await page.goto('./authors/does-not-exist')
  expect(response?.status()).toBe(404)
})
