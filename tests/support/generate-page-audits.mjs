import { readdir, mkdir, writeFile } from 'node:fs/promises'
import { join, relative, sep } from 'node:path'

const root = 'apps/wiki/.output/public'
async function findPages(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const pages = await Promise.all(entries.map(async entry => {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) return findPages(path)
    // Nuxt's 200/404.html are host fallback documents, not published app routes.
    if (entry.name !== 'index.html') return []
    return [relative(root, directory).split(sep).join('/') || '.']
  }))
  return pages.flat().sort()
}
const routes = await findPages(root)
if (!routes.includes('.')) throw new Error('Build the wiki before generating page audits')
const profiles = ['fresh-desktop', 'en-dark-desktop', 'de-light-desktop', 'en-light-mobile', 'de-dark-mobile']
const rows = routes.flatMap(route => profiles.map(profile => `      | ${route === '.' ? './' : `./${route}/`} | ${profile} |`))
await mkdir('.generated-tests', { recursive: true })
await writeFile('.generated-tests/pages.feature', `# Generated from production HTML; do not edit.
@page-audit
Feature: Every published page is accessible and hydrates cleanly
  Scenario Outline: Audit <route> with <profile>
    Given a reader using "<profile>"
    When the reader opens the published page "<route>"
    Then the page has no automatically detectable accessibility violations
    And its shared controls remain accessible and interactive

    Examples:
      | route | profile |
${rows.join('\n')}
`)
console.log(`Generated ${routes.length} routes × ${profiles.length} reader profiles`)
