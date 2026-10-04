import { lstat, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const args = process.argv.slice(2)
if (args.some(arg => !['--yes', '--include-private', '--help'].includes(arg))) throw new Error('Unknown option. Use --help.')
if (args.includes('--help')) {
  console.log('pnpm content:reset [--yes] [--include-private]\nPreview by default. --yes deletes public content and generated caches.\n--include-private also deletes private content. raw/, logs, code and Git history are preserved.')
  process.exit(0)
}
const manifest = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'))
if (manifest.name !== 'commonplace-workspace') throw new Error('Expected the Commonplace workspace root.')
async function inspect(path) {
  const stat = await lstat(path)
  if (stat.isSymbolicLink()) throw new Error(`Refusing symlink: ${relative(root, path)}`)
  if (stat.isDirectory()) for (const child of await readdir(path)) await inspect(join(path, child))
}
for (const path of ['apps', 'apps/wiki', 'apps/wiki/content']) {
  const stat = await lstat(join(root, path))
  if (!stat.isDirectory() || stat.isSymbolicLink()) throw new Error(`Expected a real directory: ${path}`)
}
const targets = []
const contentFolders = []
for (const audience of args.includes('--include-private') ? ['public', 'private'] : ['public']) {
  const folder = join(root, 'apps/wiki/content', audience)
  await inspect(folder)
  contentFolders.push(folder)
  for (const name of await readdir(folder)) if (name !== '.gitkeep') targets.push(join(folder, name))
}
for (const cache of ['.generated', '.output', '.data']) {
  const path = join(root, 'apps/wiki', cache)
  try { await inspect(path); targets.push(path) } catch (error) { if (error.code !== 'ENOENT') throw error }
}
console.log(args.includes('--yes') ? 'Deleting:' : 'Preview — nothing will be deleted:')
for (const target of targets) console.log(`  ${relative(root, target)}`)
if (!args.includes('--yes')) {
  console.log('Add --yes to apply. Add --include-private to also remove private content.')
} else {
  for (const target of targets) await rm(target, { recursive: true, force: false })
  for (const folder of contentFolders) await writeFile(join(folder, '.gitkeep'), '', { flag: 'a' })
  console.log('Content reset. Stop/restart the dev server or run pnpm build before previewing. Browser offline copies and Git history are not erased.')
}
