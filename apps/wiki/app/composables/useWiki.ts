import { createKnowledge } from '../utils/knowledge'
export async function useWiki() {
  const { data, error } = await useAsyncData('wiki-library', () => queryCollection('notes').order('updated', 'DESC').all())
  if (error.value) throw createError({ statusCode: 500, statusMessage: 'Das Wiki konnte nicht geladen werden.' })
  return computed(() => createKnowledge(data.value ?? []))
}
