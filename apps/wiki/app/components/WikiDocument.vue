<script setup lang="ts">
import { MarkdownDocument } from '@comark/vue'
import type { MarkdownDocument as Document } from 'comark'
import Insight from './Insight.vue'
import SourceReference from './SourceReference.vue'
import ProseLink from './ProseLink.vue'
const props = defineProps<{ document: string }>()
const parsed = computed<Document>(() => JSON.parse(props.document))
const components = { insight: Insight, 'source-reference': SourceReference, a: ProseLink }
</script>
<template><MarkdownDocument :value="parsed" :components="components" class="prose" /></template>
