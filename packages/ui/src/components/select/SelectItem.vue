<script setup lang="ts">
import { SelectItem, SelectItemIndicator, SelectItemText } from 'reka-ui'
defineProps<{ value: string; disabled?: boolean }>()
</script>
<template><SelectItem :value="value" :disabled="disabled" class="ui-select-item"><SelectItemText><slot /></SelectItemText><SelectItemIndicator class="ui-select-check" aria-hidden="true">✓</SelectItemIndicator></SelectItem></template>
