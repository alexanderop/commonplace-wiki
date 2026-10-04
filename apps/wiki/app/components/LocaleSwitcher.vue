<script setup lang="ts">
import { Select, SelectTrigger, SelectValue, SelectIcon, SelectContent, SelectItem } from '@commonplace/ui/select'
defineOptions({ inheritAttrs: false })
const { locale, localeNames, t, setLocale } = useI18n()
</script>
<template>
  <Select v-slot="{ open }" :model-value="locale" @update:model-value="value => { if (typeof value === 'string') setLocale(value) }">
    <SelectTrigger v-bind="$attrs" class="locale-switcher ui-select-trigger" :aria-label="t('language')">
      <SelectValue>{{ localeNames[locale] }}</SelectValue><SelectIcon class="ui-select-chevron" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="m4 6 4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /></svg></SelectIcon>
    </SelectTrigger>
    <SelectContent :open="open" :label="t('language')"><SelectItem v-for="(name, code) in localeNames" :key="code" :value="code" :lang="code">{{ name }}</SelectItem></SelectContent>
  </Select>
</template>
