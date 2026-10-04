<script setup lang="ts">
import { ref } from 'vue'
const value = defineModel<string>({ default: '' })
const element = ref<HTMLInputElement>()
defineExpose({ focus: () => element.value?.focus() })
</script>
<template><input ref="element" v-model="value" class="ui-input" /></template>
