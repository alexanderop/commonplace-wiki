<script setup lang="ts">
const { t } = useI18n()
defineProps<{ source: string; timestamp?: string }>()
</script>
<template>
  <aside class="source-reference"><span class="eyebrow">↗ {{ t('sourceReference') }}</span><div><slot /></div><NuxtLink :to="`/notes/${source}`">{{ t('openSource') }} <span v-if="timestamp">· {{ timestamp }}</span> ↗</NuxtLink></aside>
</template>
