<script setup lang="ts">
import { Button as UiButton } from '@commonplace/ui/button'
const { t } = useI18n()
const { $pwa } = useNuxtApp()
const offline = ref(false)
const ready = ref(false)
const failed = ref(false)
const development = import.meta.dev
watch(() => $pwa?.registrationError, error => { if (error) failed.value = true })
let cancelled = false
function updateConnection() { offline.value = !navigator.onLine }
onMounted(async () => {
  updateConnection()
  window.addEventListener('online', updateConnection)
  window.addEventListener('offline', updateConnection)
  if (development) return
  if (!('serviceWorker' in navigator)) { failed.value = true; return }
  const registration = await navigator.serviceWorker.ready
  if (!cancelled && registration.active) ready.value = true
})
onBeforeUnmount(() => { cancelled = true; window.removeEventListener('online', updateConnection); window.removeEventListener('offline', updateConnection) })
</script>
<template><div class="offline-status"><span class="status-dot" :class="{ ready }" /><div><strong>{{ development ? t('development') : ready ? t('offlineReady') : failed ? t('offlineFailed') : t('offlinePreparing') }}</strong><span>{{ offline ? t('readingOffline') : t('knowledgeStays') }}</span></div><UiButton variant="plain" size="inherit" v-if="$pwa?.needRefresh" class="quiet-button" @click="$pwa.updateServiceWorker()">{{ t('update') }}</UiButton><UiButton variant="plain" size="inherit" v-else-if="$pwa?.showInstallPrompt" class="quiet-button" @click="$pwa.install()" :aria-label="t('install')">↓</UiButton></div></template>
