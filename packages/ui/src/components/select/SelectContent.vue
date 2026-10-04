<script setup lang="ts">
import { SelectContent, SelectPortal, SelectViewport } from 'reka-ui'
defineOptions({ inheritAttrs: false })
defineProps<{ open: boolean; label: string }>()
</script>
<template>
  <SelectPortal><div v-if="open" class="ui-select-dialog" role="dialog" aria-modal="true" :aria-label="label"><SelectContent v-bind="$attrs" :aria-label="label" position="popper" align="end" :side-offset="8" :collision-padding="12" class="ui-select-content"><SelectViewport><slot /></SelectViewport></SelectContent></div></SelectPortal>
</template>
