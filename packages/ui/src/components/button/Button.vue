<script setup lang="ts">
import { Primitive, type PrimitiveProps } from 'reka-ui'
import type { ButtonHTMLAttributes } from 'vue'
withDefaults(defineProps<PrimitiveProps & {
  variant?: 'solid' | 'outline' | 'ghost' | 'plain'
  size?: 'sm' | 'md' | 'icon' | 'inherit'
  type?: ButtonHTMLAttributes['type']
}>(), { as: 'button', variant: 'outline', size: 'md', type: 'button' })
</script>
<template>
  <Primitive :as="as" :as-child="asChild" :type="as === 'button' && !asChild ? type : undefined" class="ui-button" :class="[`ui-button--${variant}`, `ui-button--${size}`]"><slot /></Primitive>
</template>
