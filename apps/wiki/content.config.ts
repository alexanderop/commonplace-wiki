import { resolve } from 'node:path'
import { defineCollection, defineContentConfig } from '@nuxt/content'
import { compiledNoteSchema } from './shared/wiki'

export default defineContentConfig({
  collections: {
    notes: defineCollection({
      type: 'data',
      source: { cwd: resolve('.generated', process.env.WIKI_AUDIENCE ?? 'public'), include: '*.json' },
      schema: compiledNoteSchema,
    }),
  },
})
