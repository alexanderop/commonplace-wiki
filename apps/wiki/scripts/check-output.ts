import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'
async function files(path: string): Promise<string[]> {
  const entries = await readdir(path, { withFileTypes: true })
  return (await Promise.all(entries.map(entry => entry.isDirectory() ? files(join(path, entry.name)) : [join(path, entry.name)]))).flat()
}
const forbidden = ['PRIVATE_WIKI_SENTINEL_8c2b1e', 'private-fixture', process.cwd()]
for (const file of await files('.output/public')) {
  const bytes = await readFile(file)
  for (const marker of forbidden) if (bytes.includes(Buffer.from(marker))) throw new Error(`Public artifact contains ${marker}: ${file}`)
}
for (const file of await readdir('.generated/public')) {
  if (!file.endsWith('.json')) continue
  const note = JSON.parse(await readFile(join('.generated/public', file), 'utf8')) as { noteId: string; document: string }
  const article = await readFile(`.output/public/notes/${note.noteId}/index.html`, 'utf8')
  if (!article.includes('<article>')) throw new Error(`Missing rendered article: ${note.noteId}`)
  if (note.document.includes('"insight"') && !article.includes('insight-block')) throw new Error(`Missing rendered insight: ${note.noteId}`)
}
console.log('Verified public artifact exclusion and rendered articles.')
