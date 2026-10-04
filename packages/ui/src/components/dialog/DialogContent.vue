<script setup lang="ts">
import { DialogContent, DialogOverlay, DialogPortal, useForwardPropsEmits, type DialogContentProps, type DialogContentEmits } from 'reka-ui'
defineOptions({ inheritAttrs: false })
const props = defineProps<DialogContentProps>()
const emit = defineEmits<DialogContentEmits>()
const forwarded = useForwardPropsEmits(props, emit)
</script>
<template>
  <DialogPortal>
    <DialogOverlay class="ui-dialog-overlay" />
    <DialogContent v-bind="{ ...forwarded, ...$attrs }" class="ui-dialog-content"><slot /></DialogContent>
  </DialogPortal>
</template>
