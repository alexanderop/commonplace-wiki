<script setup lang="ts">
import { Button as UiButton } from '@commonplace/ui/button'
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogClose } from '@commonplace/ui/dialog'
const { t } = useI18n()
const { theme, toggle } = useTheme()
const route = useRoute()
const menuOpen = ref(false)
const config = useRuntimeConfig()
const desktopNavigation = ref<HTMLElement>()
let desktop: MediaQueryList | undefined
function closeOnDesktop() { if (desktop?.matches) menuOpen.value = false }
function restoreFocus(event: Event) {
  if (desktop?.matches) { event.preventDefault(); desktopNavigation.value?.querySelector<HTMLElement>('a')?.focus() }
}
onMounted(() => {
  desktop = window.matchMedia('(min-width: 681px)')
  desktop.addEventListener('change', closeOnDesktop)
})
onBeforeUnmount(() => desktop?.removeEventListener('change', closeOnDesktop))
watch(() => route.path, () => { menuOpen.value = false })
</script>
<template>
  <Dialog v-model:open="menuOpen"><div class="app-shell">
    <header class="topbar"><NuxtLink to="/" class="brand" :aria-label="t('home')"><img :src="`${config.app.baseURL}brand/icon-192.png`" width="35" height="35" alt="" class="brand-logo" /><span>commonplace<span class="brand-dot">.</span></span></NuxtLink><nav class="topnav" :aria-label="t('navigation')"><NuxtLink to="/"><span>[B]</span> {{ t('library') }}</NuxtLink><NuxtLink to="/graph"><span>[G]</span> {{ t('graph') }}</NuxtLink><NuxtLink to="/about"><span>[?]</span> {{ t('about') }}</NuxtLink></nav><LocaleSwitcher class="desktop-locale" /><UiButton variant="plain" size="inherit" class="theme-toggle quiet-button" :aria-label="theme === 'dark' ? t('lightTheme') : t('darkTheme')" @click="toggle"><span aria-hidden="true">{{ theme === 'dark' ? '☀' : '☾' }}</span></UiButton><span class="edition-label">{{ config.public.audience === 'personal' ? t('personalEdition') : t('demoEdition') }}<span class="tiny-dot" /></span><DialogTrigger as-child><UiButton variant="plain" size="inherit" class="mobile-toggle quiet-button">{{ t('menu') }}</UiButton></DialogTrigger></header>
    <div class="shell-search"><SearchDialog /></div><div class="workspace"><aside ref="desktopNavigation" class="sidebar desktop-sidebar"><LibraryNavigation /></aside><main id="main-content" class="main-content"><slot /></main></div>
  </div>
    <DialogContent class="mobile-navigation sidebar" :aria-describedby="undefined" @close-auto-focus="restoreFocus">
      <div class="mobile-navigation-heading"><DialogTitle>{{ t('yourLibrary') }}</DialogTitle><DialogClose as-child><UiButton variant="plain" size="inherit" class="quiet-button">{{ t('closeMenu') }}</UiButton></DialogClose></div>
      <LocaleSwitcher /><LibraryNavigation />
    </DialogContent>
  </Dialog>
</template>
