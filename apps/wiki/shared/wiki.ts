import { z } from 'zod'

export const noteKindSchema = z.enum(['source', 'concept', 'insight'])
export const resourceTypes = ['blog', 'youtube', 'podcast', 'film', 'book', 'documentation', 'other'] as const
export const resourceTypeSchema = z.enum(resourceTypes)
export type ResourceType = z.infer<typeof resourceTypeSchema>
export const relationSchema = z.object({ target: z.string(), kind: z.enum(['links', 'builds-on', 'contradicts']) })
export const noteMetadataSchema = z.object({
  noteId: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().min(1),
  description: z.string().min(1),
  kind: noteKindSchema,
  resourceType: resourceTypeSchema.optional(),
  updated: z.iso.date(),
  tags: z.array(z.string()).default([]),
  sourceUrl: z.url().refine(value => /^https?:\/\//.test(value)).optional(),
  author: z.string().optional(),
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
