<script setup lang="ts">
import { Button as UiButton } from '@commonplace/ui/button'
import { Input as UiInput } from '@commonplace/ui/input'
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogClose } from '@commonplace/ui/dialog'
const { t, resourceLabel, kindLabel } = useI18n()
const wiki = await useWiki()
const isOpen = ref(false)
const query = ref('')
const input = ref<InstanceType<typeof UiInput>>()
const results = computed(() => wiki.value.search(query.value).slice(0, 12))
const route = useRoute()
function keyboard(event: KeyboardEvent) {
  if ((event.metaKey || event.ctrlKey) && event.key === 'k') { event.preventDefault(); isOpen.value = true }
}
function focusSearch(event: Event) { event.preventDefault(); input.value?.focus() }
onMounted(() => window.addEventListener('keydown', keyboard))
onBeforeUnmount(() => window.removeEventListener('keydown', keyboard))
watch(() => route.fullPath, () => { isOpen.value = false })
</script>
<template>
  <Dialog v-model:open="isOpen">
    <DialogTrigger as-child>
      <UiButton variant="plain" size="inherit" class="search-trigger"><span>⌕</span><span>{{ t('findThoughts') }}</span><kbd>⌘ K</kbd></UiButton>
    </DialogTrigger>
    <DialogContent class="search-dialog" :aria-describedby="undefined" @open-auto-focus="focusSearch">
      <div class="search-top">
        <DialogTitle as-child><label for="wiki-search" class="eyebrow">{{ t('searchLabel') }}</label></DialogTitle>
        <DialogClose as-child><UiButton variant="plain" size="inherit" class="quiet-button" :aria-label="t('closeSearch')">Esc ×</UiButton></DialogClose>
      </div>
      <UiInput id="wiki-search" ref="input" v-model="query" :placeholder="t('searchPlaceholder')" autocomplete="off" />
      <div class="search-hint eyebrow">{{ query ? t(results.length === 1 ? 'result' : 'results', { count: results.length }) : t('recent') }} · {{ t('fullText') }}</div>
      <ul class="search-results" :aria-label="t('searchResults')">
        <li v-for="note in results" :key="note.noteId"><NuxtLink :to="`/notes/${note.noteId}`" @click="isOpen = false"><span class="eyebrow">{{ note.kind === 'source' ? resourceLabel(note.resourceType) : kindLabel(note.kind) }}</span><strong>{{ note.title }}</strong><span>{{ note.description }}</span></NuxtLink></li>
      </ul>
      <p v-if="!results.length" class="empty-state">{{ t('emptySearch') }}</p>
    </DialogContent>
  </Dialog>
</template>
