<script setup lang="ts">
import { NativeSelect } from '@commonplace/ui/select'
const { locale, localeNames, t, setLocale } = useI18n()
function change(event: Event) {
  if (event.target instanceof HTMLSelectElement) setLocale(event.target.value)
}
</script>
<template>
  <NativeSelect class="locale-switcher" :aria-label="t('language')" :value="locale" @change="change">
    <option v-for="(name, code) in localeNames" :key="code" :value="code" :lang="code">{{ name }}</option>
  </NativeSelect>
</template>
