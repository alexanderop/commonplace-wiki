import { z } from 'zod'

export const noteKindSchema = z.enum(['source', 'concept', 'insight'])
export const resourceTypes = ['blog', 'youtube', 'podcast', 'film', 'book', 'documentation', 'other'] as const
export const resourceTypeSchema = z.enum(resourceTypes)
export type ResourceType = z.infer<typeof resourceTypeSchema>
export const relationSchema = z.object({ target: z.string(), kind: z.enum(['links', 'builds-on', 'contradicts']) })
export const contributorRoles = ['author', 'host', 'guest', 'editor', 'translator', 'director', 'speaker', 'organization'] as const
export const contributorSchema = z.object({
  id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
  name: z.string().trim().min(1),
  url: z.url().refine(value => /^https?:\/\//.test(value)).optional(),
  roles: z.array(z.enum(contributorRoles)).min(1).default(['author']),
})
export type ContributorRole = typeof contributorRoles[number]
export const noteMetadataSchema = z.object({
  noteId: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().min(1),
  description: z.string().min(1),
  kind: noteKindSchema,
  resourceType: resourceTypeSchema.optional(),
  updated: z.iso.date(),
  tags: z.array(z.string()).default([]),
  sourceUrl: z.url().refine(value => /^https?:\/\//.test(value)).optional(),
  contributors: z.array(contributorSchema).default([]),
  author: z.string().trim().min(1).optional(),
  authorId: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
  authorUrl: z.url().refine(value => /^https?:\/\//.test(value)).optional(),
  demo: z.boolean().default(true),
  relations: z.array(relationSchema).default([]),
})
export const compiledNoteSchema = noteMetadataSchema.extend({
  document: z.string(),
  markdown: z.string(),
  searchText: z.string(),
  readingMinutes: z.number(),
  headings: z.array(z.object({ id: z.string(), text: z.string(), depth: z.number() })),
})
export type NoteKind = z.infer<typeof noteKindSchema>
export type Note = z.infer<typeof compiledNoteSchema>
export type Relation = z.infer<typeof relationSchema>
export const kindLabels: Record<NoteKind, string> = { source: 'Quelle', concept: 'Thema', insight: 'Erkenntnis' }
export const kindColors: Record<NoteKind, string> = { source: '#698575', concept: '#c16b4e', insight: '#8b80a4' }

export function authorIdFor(note: Pick<Note, 'author' | 'authorId'>): string | undefined {
  if (!note.author) return undefined
  return note.authorId ?? (note.author.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || undefined)
}

export function contributorsFor(note: Pick<Note, 'contributors' | 'author' | 'authorId' | 'authorUrl'>) {
  const credits = note.contributors?.length ? note.contributors : note.author ? [{ id: note.authorId, name: note.author, url: note.authorUrl, roles: ['author'] as ContributorRole[] }] : []
  return credits.map(credit => {
    const id = authorIdFor({ author: credit.name, authorId: credit.id })
    if (!id) throw new Error(`Supply an explicit contributor id for ${credit.name}`)
    return { ...credit, id, roles: [...new Set(credit.roles)] }
  })
}
