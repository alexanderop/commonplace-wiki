<script setup lang="ts">
defineProps<{ href?: string }>()
</script>
<template><NuxtLink v-if="href?.startsWith('/notes/')" :to="href"><slot /></NuxtLink><a v-else :href="href" :rel="href?.startsWith('http') ? 'noopener noreferrer' : undefined"><slot /></a></template>
