<script setup lang="ts">
import { contributorsFor } from '#shared/wiki'
const { t } = useI18n()
const route = useRoute()
const wiki = await useWiki()
const author = computed(() => wiki.value.author(String(route.params.id)))
if (!author.value) throw createError({ statusCode: 404, statusMessage: t('authorMissing') })
useSeoMeta({ title: () => `${author.value?.name} · ${t('authors')} · Commonplace` })
</script>
<template>
  <WikiShell><div v-if="author" class="library-page authors-page">
    <NuxtLink to="/authors" class="text-link">← {{ t('authors') }}</NuxtLink>
    <header class="author-heading"><span class="author-avatar" aria-hidden="true">{{ Array.from(author.name)[0] }}</span><h1>{{ author.name }}</h1></header>
    <a v-if="author.url" class="text-link" :href="author.url" target="_blank" rel="noopener noreferrer">{{ t('authorWebsite') }} ↗</a>
    <section class="author-resources" aria-labelledby="author-resources-heading">
      <div class="section-heading"><h2 id="author-resources-heading">{{ t('authorResources', { name: author.name }) }}</h2><span class="eyebrow">{{ t('authorCount', { count: author.resources.length }) }}</span></div>
      <div class="note-grid"><div v-for="note in author.resources" :key="note.noteId"><p class="eyebrow">{{ contributorsFor(note).find(credit => credit.id === author!.id)?.roles.map(role => t(`credit_${role}`)).join(' · ') }}</p><NoteCard :note="note" /></div></div>
    </section>
  </div></WikiShell>
</template>
