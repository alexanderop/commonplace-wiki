<script setup lang="ts">
const { t, locale, restoreLocale } = useI18n()
onMounted(restoreLocale)
useHead(() => ({ htmlAttrs: { lang: locale.value } }))
</script>
<template><NuxtPwaManifest /><a href="#main-content" class="skip-link">{{ t('skip') }}</a><NuxtPage /></template>
