<script setup lang="ts">
import { Button as UiButton } from '@commonplace/ui/button'
const { t } = useI18n()
const { theme, toggle } = useTheme()
const wiki = await useWiki()
const route = useRoute()
const menuOpen = ref(false)
const config = useRuntimeConfig()
watch(() => route.path, () => { menuOpen.value = false })
</script>
<template>
  <div class="app-shell">
    <header class="topbar"><NuxtLink to="/" class="brand" :aria-label="t('home')"><img :src="`${config.app.baseURL}brand/icon-192.png`" width="35" height="35" alt="" class="brand-logo" /><span>commonplace<span class="brand-dot">.</span></span></NuxtLink><nav class="topnav" :aria-label="t('navigation')"><NuxtLink to="/"><span>[B]</span> {{ t('library') }}</NuxtLink><NuxtLink to="/graph"><span>[G]</span> {{ t('graph') }}</NuxtLink><NuxtLink to="/about"><span>[?]</span> {{ t('about') }}</NuxtLink></nav><LocaleSwitcher /><UiButton variant="plain" size="inherit" class="theme-toggle quiet-button" :aria-label="theme === 'dark' ? t('lightTheme') : t('darkTheme')" @click="toggle"><span aria-hidden="true">{{ theme === 'dark' ? '☀' : '☾' }}</span></UiButton><span class="edition-label">{{ config.public.audience === 'personal' ? t('personalEdition') : t('demoEdition') }}<span class="tiny-dot" /></span><UiButton variant="plain" size="inherit" class="mobile-toggle quiet-button" :aria-expanded="menuOpen" aria-controls="library-sidebar" @click="menuOpen = !menuOpen">{{ menuOpen ? t('closeMenu') : t('menu') }}</UiButton></header>
    <div class="workspace"><aside id="library-sidebar" class="sidebar" :class="{ 'is-open': menuOpen }"><SearchDialog /><div class="sidebar-heading eyebrow">{{ t('yourLibrary') }} <span>{{ String(wiki.notes.length).padStart(2, '0') }}</span></div><NuxtLink to="/" class="sidebar-overview">▦ <span>{{ t('allNotes') }}</span></NuxtLink><NuxtLink to="/graph" class="sidebar-overview sidebar-graph">⌘ <span>{{ t('graph') }}</span></NuxtLink><nav :aria-label="t('notes')"><details v-for="section in [{ kind: 'concept', label: t('topics') }, { kind: 'source', label: t('sources') }, { kind: 'insight', label: t('insights') }]" :key="section.kind" open><summary><span>{{ section.label }}</span><span>{{ wiki.notes.filter(n => n.kind === section.kind).length }}</span></summary><NuxtLink v-for="note in wiki.notes.filter(n => n.kind === section.kind)" :key="note.noteId" :to="`/notes/${note.noteId}`" class="tree-link"><span class="tree-branch">└</span><span>{{ note.title }}</span></NuxtLink></details></nav><div class="sidebar-footer"><NuxtLink to="/about" class="small-link">↗ {{ t('filesFooter') }}</NuxtLink><OfflineStatus /></div></aside><main id="main-content" class="main-content"><slot /></main></div>
  </div>
</template>
