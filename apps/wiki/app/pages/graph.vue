<script setup lang="ts">
import { Button as UiButton } from '@commonplace/ui/button'
const { t, kindLabel } = useI18n()
import type { NoteKind } from '#shared/wiki'
const wiki = await useWiki()
const selected = ref<NoteKind | 'all'>('all')
const graph = computed(() => wiki.value.graph(undefined, selected.value === 'all' ? undefined : selected.value))
const filters = computed<{ value: NoteKind | 'all'; label: string }[]>(() => [{ value: 'all', label: t('all') }, { value: 'concept', label: t('topics') }, { value: 'source', label: t('sources') }, { value: 'insight', label: t('insights') }])
useSeoMeta({ title: () => `${t('graph')} · Commonplace` })
</script>
<template><WikiShell><div class="graph-page"><div class="page-kicker eyebrow"><span>{{ t('discoverConnections') }}</span><span>{{ t('graphStats', { nodes: graph.nodes.length, links: graph.links.length }) }}</span></div><h1>{{ t('graphFirst') }}<br /><span>{{ t('graphSecond') }}</span></h1><p class="graph-intro">{{ t('graphIntro') }}</p><div class="graph-toolbar"><div class="filter-tabs" role="group" :aria-label="t('filterGraph')"><UiButton variant="plain" size="inherit" v-for="filter in filters" :key="filter.value" :aria-pressed="selected === filter.value" @click="selected = filter.value">{{ filter.label }}</UiButton></div><span class="eyebrow">{{ t('graphGesture') }}</span></div><div class="full-graph"><ClientOnly><KnowledgeGraph :graph="graph" :height="490" @open="navigateTo(`/notes/${$event}`)" /><template #fallback><div class="graph-placeholder large" /></template></ClientOnly></div><div class="graph-bottom"><p>{{ t('graphExplanation') }}</p><span class="eyebrow">{{ t('discoverPages', { count: graph.nodes.length }) }}</span></div><ul class="graph-note-list" :aria-label="t('graphPages')"><li v-for="node in graph.nodes" :key="node.id" :data-kind="node.kind"><NuxtLink :to="`/notes/${node.id}`"><i class="kind-dot" :class="node.kind" />{{ node.title }}<span class="eyebrow">{{ kindLabel(node.kind) }} ↗</span></NuxtLink></li></ul></div></WikiShell></template>
