<script setup lang="ts">
const { t } = useI18n()
const wiki = await useWiki()
useSeoMeta({ title: () => `${t('authors')} · Commonplace` })
</script>
<template>
  <WikiShell><div class="library-page authors-page">
    <div class="page-kicker eyebrow">{{ t('library') }}</div>
    <h1>{{ t('authors') }}</h1><p class="article-description">{{ t('authorsIntro') }}</p>
    <ul v-if="wiki.authors.length" class="author-list">
      <li v-for="author in wiki.authors" :key="author.id"><NuxtLink :to="`/authors/${author.id}`">
        <span class="author-avatar" aria-hidden="true">{{ Array.from(author.name)[0] }}</span>
        <span><strong>{{ author.name }}</strong><span class="eyebrow">{{ t('authorCount', { count: author.resources.length }) }}</span></span><span aria-hidden="true">↗</span>
      </NuxtLink></li>
    </ul><p v-else role="status">{{ t('noAuthors') }}</p>
  </div></WikiShell>
</template>
