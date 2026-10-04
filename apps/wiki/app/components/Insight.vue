<script setup lang="ts">
const { t } = useI18n()
defineProps<{ title?: string }>()
</script>
<template>
  <aside class="insight-block"><span class="eyebrow">✳ {{ t('thoughtNote') }}</span><strong v-if="title">{{ title }}</strong><div><slot /></div></aside>
</template>
