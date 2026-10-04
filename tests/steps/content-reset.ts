import { mkdtemp, mkdir, writeFile, readFile, cp, readdir, rm, symlink } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { expect, type Page } from '@playwright/test'
import { createBdd } from 'playwright-bdd'
const exec = promisify(execFile)
const roots = new WeakMap<Page, string>()
const { Given, Then, After } = createBdd()
Given('an isolated starter with public and private content', async ({ page }) => {
  const root = await mkdtemp(join(tmpdir(), 'wiki-reset-'))
  roots.set(page, root)
  for (const folder of ['scripts', 'raw', 'apps/wiki/content/public', 'apps/wiki/content/private', 'apps/wiki/.generated/public', 'apps/wiki/.output', 'apps/wiki/.data']) await mkdir(join(root, folder), { recursive: true })
  await writeFile(join(root, 'package.json'), JSON.stringify({ name: 'commonplace-workspace' }))
  await cp(resolve('scripts/reset-content.mjs'), join(root, 'scripts/reset-content.mjs'))
  for (const file of ['apps/wiki/content/public/note.md', 'apps/wiki/content/private/note.md', 'raw/original.md', 'apps/wiki/.output/index.html']) await writeFile(join(root, file), 'keep until explicitly removed')
  await writeFile(join(root, 'apps/wiki/content/private/.gitkeep'), '')
})
async function reset(page: Page, ...args: string[]) { return exec(process.execPath, [join(roots.get(page)!, 'scripts/reset-content.mjs'), ...args]) }
Then('resetting without confirmation preserves all files', async ({ page }) => {
  expect((await reset(page)).stdout).toContain('Preview')
  for (const file of ['apps/wiki/content/public/note.md', 'apps/wiki/content/private/note.md', 'apps/wiki/.output/index.html']) expect(await readFile(join(roots.get(page)!, file), 'utf8')).toContain('keep')
})
Then('resetting public content preserves private notes and raw sources', async ({ page }) => {
  await reset(page, '--yes')
  const root = roots.get(page)!
  expect(await readdir(join(root, 'apps/wiki/content/public'))).toEqual(['.gitkeep'])
  for (const file of ['apps/wiki/content/private/note.md', 'raw/original.md']) expect(await readFile(join(root, file), 'utf8')).toContain('keep')
  for (const cache of ['.generated', '.output', '.data']) await expect(readdir(join(root, 'apps/wiki', cache))).rejects.toThrow()
})
Then('explicitly resetting private content empties the remaining collection', async ({ page }) => {
  await reset(page, '--include-private', '--yes')
  expect(await readdir(join(roots.get(page)!, 'apps/wiki/content/private'))).toEqual(['.gitkeep'])
})
Then('reset refuses a symbolic link before deleting any content', async ({ page }) => {
  const root = roots.get(page)!
  await symlink(join(root, 'raw'), join(root, 'apps/wiki/content/public/linked'))
  await expect(reset(page, '--yes')).rejects.toThrow('Refusing symlink')
  expect(await readFile(join(root, 'apps/wiki/content/public/note.md'), 'utf8')).toContain('keep')
  expect(await readFile(join(root, 'raw/original.md'), 'utf8')).toContain('keep')
})
After('@content-reset', async ({ page }) => { const root = roots.get(page); if (root) await rm(root, { recursive: true, force: true }) })
