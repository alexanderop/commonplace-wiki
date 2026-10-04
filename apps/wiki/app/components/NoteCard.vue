<script setup lang="ts">
const { t, resourceLabel, kindLabel } = useI18n()
import type { Note } from '#shared/wiki'
defineProps<{ note: Note; index?: number }>()
</script>
<template><NuxtLink :to="`/notes/${note.noteId}`" class="note-card"><div class="card-top"><span class="eyebrow"><i class="kind-dot" :class="note.kind" />{{ note.kind === 'source' ? resourceLabel(note.resourceType) : kindLabel(note.kind) }}</span><span class="card-arrow">↗</span></div><h3>{{ note.title }}</h3><p>{{ note.description }}</p><div class="card-bottom"><span>{{ note.tags[0] }}</span><span>{{ t('minutes', { count: note.readingMinutes }) }}</span></div></NuxtLink></template>
