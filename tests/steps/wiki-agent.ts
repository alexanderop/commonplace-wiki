import { mkdtemp, mkdir, writeFile, readFile, rm, readdir } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { resolve, join } from 'node:path'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { expect, type Page } from '@playwright/test'
import { createBdd } from 'playwright-bdd'

const exec = promisify(execFile)
const inspector = resolve('.agents/skills/wiki-extract-source/scripts/inspect-source.mjs')
const compiler = resolve('apps/wiki/scripts/compile-wiki.ts')
const roots = new WeakMap<Page, string>()
const { Given, Then, After } = createBdd()
const source = `---\nnoteId: existing-video\ntitle: Existing video\ndescription: A synthetic source for agent validation.\nkind: source\nresourceType: youtube\nsourceUrl: https://www.youtube.com/watch?v=abcdefghijk\nupdated: 2026-10-04\ndemo: false\n---\nPersonal annotation that must survive duplicate inspection.\n`
Given('an isolated wiki with an existing private video source', async ({ page }) => {
  const root = await mkdtemp(join(tmpdir(), 'wiki-agent-'))
  roots.set(page, root)
  for (const folder of ['public', 'private']) await mkdir(join(root, 'apps/wiki/content', folder), { recursive: true })
  await writeFile(join(root, 'apps/wiki/content/private/existing-video.md'), source)
})
After('@wiki-agent', async ({ page }) => { const root = roots.get(page); if (root) await rm(root, { recursive: true, force: true }) })
async function inspect(page: Page, url: string, evidence?: string) {
  const root = roots.get(page)!
  const { stdout } = await exec(process.execPath, [inspector, '--root', root, '--url', url, ...(evidence ? ['--evidence', evidence] : [])])
  return JSON.parse(stdout)
}
Then('alternate video URLs identify the existing source without modifying it', async ({ page }) => {
  for (const url of ['https://youtu.be/abcdefghijk?t=60', 'https://www.youtube.com/shorts/abcdefghijk', 'https://m.youtube.com/watch?v=abcdefghijk&utm_source=test']) {
    const result = await inspect(page, url)
    expect(result.key).toBe('youtube:abcdefghijk')
    expect(result.action).toBe('review-existing')
    expect(result.matches).toEqual([{ noteId: 'existing-video', title: 'Existing video', audience: 'private', path: 'apps/wiki/content/private/existing-video.md' }])
  }
  const directory = join(roots.get(page)!, 'apps/wiki/content/private')
  expect(await readdir(directory)).toEqual(['existing-video.md'])
  expect(await readFile(join(directory, 'existing-video.md'), 'utf8')).toBe(source)
})
Then('a source without evidence is pending and an empty transcript is not evidence', async ({ page }) => {
  expect(await inspect(page, 'https://youtu.be/lmnopqrstuv')).toMatchObject({ evidence: 'missing', analysis: 'pending', action: 'new-source' })
  await writeFile(join(roots.get(page)!, 'empty.txt'), ' \n')
  expect(await inspect(page, 'https://youtu.be/lmnopqrstuv', 'empty.txt')).toMatchObject({ evidence: 'empty', analysis: 'pending' })
})
Then('supplied evidence is available without claiming it has been verified', async ({ page }) => {
  await writeFile(join(roots.get(page)!, 'transcript.txt'), 'A synthetic excerpt with limited coverage.')
  expect(await inspect(page, 'https://youtu.be/abcdefghijk', 'transcript.txt')).toMatchObject({ evidence: 'available', analysis: 'inspect-evidence' })
})
Then('tracking parameters are ignored but distinct article identifiers are preserved', async ({ page }) => {
  const first = await inspect(page, 'https://example.com/article?id=1&utm_source=feed#section')
  const same = await inspect(page, 'https://example.com/article?id=1')
  const other = await inspect(page, 'https://example.com/article?id=2')
  expect(first.key).toBe(same.key)
  expect(first.key).not.toBe(other.key)
  expect((await inspect(page, 'https://example.com/#/article/1')).key).toContain('#/article/1')
})
Then('a public note referencing that private source fails public compilation', async ({ page }) => {
  const root = roots.get(page)!
  await writeFile(join(root, 'apps/wiki/content/public/public-note.md'), `---\nnoteId: public-note\ntitle: Public note\ndescription: Synthetic publication boundary check.\nkind: concept\nupdated: 2026-10-04\ndemo: false\n---\n[Private source](/notes/existing-video)\n`)
  const options = { cwd: join(root, 'apps/wiki'), env: { ...process.env, WIKI_AUDIENCE: 'public' } }
  await expect(exec(process.execPath, [compiler], options)).rejects.toMatchObject({ stderr: expect.stringContaining('unresolved or unpublished target existing-video') })
  const personal = await exec(process.execPath, [compiler], { ...options, env: { ...options.env, WIKI_AUDIENCE: 'personal' } })
  expect(personal.stdout).toContain('Compiled 2 personal notes')
})
