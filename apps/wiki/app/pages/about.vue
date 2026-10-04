<script setup lang="ts">
const { t } = useI18n()
useSeoMeta({ title: () => t('aboutTitle') })
</script>
<template><WikiShell><div class="about-page"><span class="eyebrow">{{ t('garden') }}</span><h1>{{ t('aboutFirst') }}<br /><span>{{ t('aboutSecond') }}</span></h1><div class="prose"><p>{{ t('aboutIntro') }}</p><h2>{{ t('aboutEdition') }}</h2><p>{{ t('aboutExamples') }}</p><h2>{{ t('aboutFiles') }}</h2><p>{{ t('aboutFilesText') }}</p><h2>{{ t('aboutOffline') }}</h2><p>{{ t('aboutOfflineText') }}</p><h2>{{ t('aboutPublish') }}</h2><p>{{ t('aboutPublishText') }}</p><NuxtLink to="/" class="text-link">{{ t('backLibrary') }} ↗</NuxtLink></div></div></WikiShell></template>
