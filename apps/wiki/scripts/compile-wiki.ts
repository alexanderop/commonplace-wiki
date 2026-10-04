import { readdir, readFile, mkdir, writeFile, rm, rename } from 'node:fs/promises'
import { resolve, join } from 'node:path'
import { parseMarkdown, type Node } from 'comark'
import toc from 'comark/plugins/toc'
import { compiledNoteSchema, noteMetadataSchema, type Note, type Relation } from '../shared/wiki.ts'

const audience = process.env.WIKI_AUDIENCE ?? 'public'
if (!['public', 'personal'].includes(audience)) throw new Error('WIKI_AUDIENCE must be public or personal')
const allowedTags = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'a', 'strong', 'em', 'del', 'code', 'pre', 'blockquote', 'ul', 'ol', 'li', 'hr', 'br', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'insight', 'source-reference'])
const notes: Note[] = []
for (const folder of audience === 'personal' ? ['public', 'private'] : ['public']) {
  for (const file of (await readdir(`content/${folder}`, { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name))) {
    if (file.isSymbolicLink()) throw new Error(`Symlink not allowed: ${file.name}`)
    if (!file.isFile() || !file.name.endsWith('.md')) continue
    const markdown = await readFile(`content/${folder}/${file.name}`, 'utf8')
    const document = await parseMarkdown(markdown, { plugins: [toc()] })
    const metadata = noteMetadataSchema.parse(document.frontmatter)
    if (metadata.kind !== 'source' && metadata.resourceType) throw new Error(`${file.name}: resourceType is only allowed on source notes`)
    if (metadata.kind === 'source') metadata.resourceType ??= 'other'
    const relations: Relation[] = [...metadata.relations]
    const headings: Note['headings'] = []
    const words: string[] = []
    function visit(node: Node) {
      if (typeof node === 'string') { words.push(node); return }
      const [tag, attrs, ...children] = node
      if (tag === null) return
      if (!allowedTags.has(tag)) throw new Error(`${file.name}: unsupported component ${tag}`)
      for (const key of Object.keys(attrs)) {
        if (/^on/i.test(key) || ['innerHTML', 'style', 'as', 'srcdoc'].includes(key)) throw new Error(`${file.name}: unsupported attribute ${key}`)
      }
      const href = attrs.href
      if (typeof href === 'string') {
        if (!/^(https?:\/\/|mailto:|\/notes\/|#)/.test(href)) throw new Error(`${file.name}: invalid link ${href}`)
        if (href.startsWith('/notes/')) relations.push({ target: href.slice(7).split('#')[0]!, kind: 'links' })
      }
      if (tag === 'source-reference') {
        if (typeof attrs.source !== 'string') throw new Error(`${file.name}: source-reference needs source`)
        relations.push({ target: attrs.source, kind: 'links' })
      }
      if (/^h[2-4]$/.test(tag) && typeof attrs.id === 'string') {
        headings.push({ id: attrs.id, text: children.filter(n => typeof n === 'string').join(''), depth: Number(tag[1]) })
      }
      children.forEach(visit)
    }
    document.nodes.forEach(visit)
    const unique = relations.filter((relation, i) => relations.findIndex(r => r.target === relation.target && r.kind === relation.kind) === i)
    notes.push(compiledNoteSchema.parse({ ...metadata, relations: unique, document: JSON.stringify(document), markdown, headings, searchText: words.join(' '), readingMinutes: Math.max(1, Math.ceil(words.join(' ').split(/\s+/).length / 180)) }))
  }
}
const ids = new Set(notes.map(note => note.noteId))
if (ids.size !== notes.length) throw new Error('Duplicate note IDs')
for (const note of notes) for (const relation of note.relations) {
  if (!ids.has(relation.target)) throw new Error(`${note.noteId}: unresolved or unpublished target ${relation.target}`)
}
const destination = resolve('.generated', audience)
const temporary = `${destination}-next`
await rm(temporary, { recursive: true, force: true })
await mkdir(temporary, { recursive: true })
for (const note of notes) await writeFile(join(temporary, `${note.noteId}.json`), JSON.stringify(note))
await rm(destination, { recursive: true, force: true })
await rename(temporary, destination)
console.log(`Compiled ${notes.length} ${audience} notes with Comark. All links resolve.`)
