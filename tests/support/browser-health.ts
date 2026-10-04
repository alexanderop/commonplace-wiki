import type { ConsoleMessage, Page } from '@playwright/test'

export function observeBrowserHealth(page: Page) {
  const failures: { url: string; kind: string; message: string }[] = []
  const onConsole = (message: ConsoleMessage) => {
    if (/hydrat(?:ion|e).*?(?:mismatch|failed|error)|mismatch.*?hydrat/i.test(message.text())) {
      failures.push({ url: page.url(), kind: 'hydration', message: message.text() })
    }
  }
  const onError = (error: Error) => failures.push({ url: page.url(), kind: 'pageerror', message: error.message })
  page.on('console', onConsole)
  page.on('pageerror', onError)
  return {
    failures,
    dispose() {
      page.off('console', onConsole)
      page.off('pageerror', onError)
    },
  }
}
