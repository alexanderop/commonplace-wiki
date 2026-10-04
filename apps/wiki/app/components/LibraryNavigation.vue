<script setup lang="ts">
const { t } = useI18n()
const wiki = await useWiki()
</script>
<template>
<div class="sidebar-heading eyebrow">{{ t('yourLibrary') }} <span>{{ String(wiki.notes.length).padStart(2, '0') }}</span></div><NuxtLink to="/" class="sidebar-overview">▦ <span>{{ t('allNotes') }}</span></NuxtLink><NuxtLink to="/graph" class="sidebar-overview sidebar-graph">⌘ <span>{{ t('graph') }}</span></NuxtLink><nav :aria-label="t('notes')"><details v-for="section in [{ kind: 'concept', label: t('topics') }, { kind: 'source', label: t('sources') }, { kind: 'insight', label: t('insights') }]" :key="section.kind" open><summary><span>{{ section.label }}</span><span>{{ wiki.notes.filter(n => n.kind === section.kind).length }}</span></summary><NuxtLink v-for="note in wiki.notes.filter(n => n.kind === section.kind)" :key="note.noteId" :to="`/notes/${note.noteId}`" class="tree-link"><span class="tree-branch">└</span><span>{{ note.title }}</span></NuxtLink></details></nav><div class="sidebar-footer"><NuxtLink to="/about" class="small-link">↗ {{ t('filesFooter') }}</NuxtLink><OfflineStatus /></div>
</template>
