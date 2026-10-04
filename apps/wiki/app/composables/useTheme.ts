type Theme = 'dark' | 'light'
export function useTheme() {
  const theme = useState<Theme>('theme', () => 'dark')
  onMounted(() => { theme.value = document.documentElement.dataset.theme === 'light' ? 'light' : 'dark' })
  function toggle() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = theme.value
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme.value === 'dark' ? '#191b19' : '#faf9f5')
    try { localStorage.setItem('commonplace-theme', theme.value) } catch {}
  }
  return { theme, toggle }
}
