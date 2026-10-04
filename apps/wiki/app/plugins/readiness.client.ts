export default defineNuxtPlugin(() => {
  onNuxtReady(() => {
    document.documentElement.dataset.hydrated = 'true'
  })
})
