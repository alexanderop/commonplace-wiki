import { readdir, readFile, stat } from 'node:fs/promises'
import { resolve, dirname, basename } from 'node:path'
const root = resolve('.agents/skills')
let skills = 0
let links = 0
async function visit(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name)
    if (entry.isSymbolicLink()) throw new Error(`Unexpected skill symlink: ${path}`)
    if (entry.isDirectory()) { await visit(path); continue }
    if (!entry.name.endsWith('.md')) continue
    const text = await readFile(path, 'utf8')
    if (entry.name === 'SKILL.md') {
      const frontmatter = text.match(/^---\n([\s\S]*?)\n---\n/)
      if (!frontmatter) throw new Error(`Missing frontmatter: ${path}`)
      const name = frontmatter[1].match(/^name: ([a-z0-9-]+)$/m)?.[1]
      if (name !== basename(directory) || !name || name.length > 64) throw new Error(`Invalid skill name: ${path}`)
      if (!/^description: .+$/m.test(frontmatter[1])) throw new Error(`Missing description: ${path}`)
      skills++
    }
    for (const match of text.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
      const target = match[1]
      if (/^(https?:|\/|#)/.test(target)) continue
      const destination = resolve(dirname(path), target.split('#')[0])
      if (!(await stat(destination)).isFile()) throw new Error(`Broken reference in ${path}: ${target}`)
      links++
    }
  }
}
await visit(root)
if (!skills) throw new Error('No wiki skills found')
console.log(`Validated ${skills} skills and ${links} local references`)
