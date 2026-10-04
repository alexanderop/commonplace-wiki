import { defineConfig, devices } from '@playwright/test'
import { defineBddConfig } from 'playwright-bdd'
const base = process.env.NUXT_APP_BASE_URL ?? '/'
const testDir = defineBddConfig({ features: ['tests/features/*.feature', '.generated-tests/*.feature'], steps: 'tests/steps/*.ts', tags: process.env.WIKI_TEST_DEMO === '1' ? undefined : 'not @demo' })
export default defineConfig({
  testDir,
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  workers: 2,
  timeout: 45000,
  expect: { timeout: 10000 },
  reporter: [['list'], ['html', { open: 'never' }]],
  use: { baseURL: `http://127.0.0.1:4173${base}`, trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }, { name: 'firefox', use: { ...devices['Desktop Firefox'] } }],
  webServer: { command: 'pnpm preview', url: `http://127.0.0.1:4173${base}`, reuseExistingServer: false },
})
