# Automated page quality

Run `pnpm verify` then `pnpm test:compat`. The existing GitHub CI runs the production suite on Chromium and Firefox at both `/` and `/wiki/`. Reports, axe JSON, failure screenshots and traces are uploaded as workflow artifacts. `pnpm test:compat --project=chromium --grep @page-audit` runs only page audits locally after building.

## Coverage

The generator walks every production `index.html`, including all compiled Markdown routes. Each route gets its own executable Gherkin scenario per reader profile, so failures name the page and profile. There is no manual note list, and a wiki with zero notes still audits its application pages. Nuxt's `200.html` and `404.html` host fallback documents are not application routes and are excluded.

| Profile | Storage | Locale | Theme | Viewport |
| --- | --- | --- | --- | --- |
| Fresh desktop | Empty | German default | Dark default | 1280 × 900 |
| English desktop | Persisted | English | Dark | 1280 × 900 |
| German desktop | Persisted | German | Light | 1280 × 900 |
| English mobile | Persisted | English | Light | 390 × 844 |
| German mobile | Persisted | German | Dark | 390 × 844 |

These are five representative profiles, not every possible combination or device. Each page is loaded directly from generated HTML, waits for Nuxt's `onNuxtReady` signal, checks the restored settings, and runs all default axe rules against the full document. The search dialog is scanned after opening; on mobile, the expanded navigation is scanned too. Focus restoration and real interactions also ensure we do not merely inspect inert server HTML. Graph canvases hidden by responsive CSS are intentionally not required to be visible.

The global browser-health hook starts before navigation for every scenario, including the existing offline and keyboard journeys. It collects Vue hydration warnings, production mismatch errors and uncaught JavaScript exceptions, retaining URL and message diagnostics. Nuxt's detailed production hydration diagnostics are enabled. No arbitrary sleep or `networkidle` substitutes for hydration readiness.

Three control scenarios verify the auditors themselves: axe detects a button without an accessible name; a real modified server response causes Vue to report a mismatch; both warning and error console channels are captured. Intentional hydration faults use a separate page so ordinary scenarios never allowlist mismatches.

Automated checks catch common accessibility defects; they do not certify WCAG compliance. Keyboard exploration, screen-reader evaluation and visual review remain necessary. Hydration checks cover the loaded routes and exercised states, not all possible future content or interactions. New Markdown can introduce genuine accessibility failures that should be fixed in its source.

## Open-source research

Inspected on 2026-10-04:

- [npmx hydration matrix](https://github.com/npmx-dev/npmx.dev/blob/main/test/e2e/hydration.spec.ts): tests fresh storage and saved preferences across routes. We adopt this idea and derive routes from our build output.
- [npmx browser helpers](https://github.com/npmx-dev/npmx.dev/blob/main/test/e2e/test-utils.ts): captures Vue console mismatch messages. Our automatic Gherkin hook asserts them after every scenario.
- [npmx accessibility tests](https://github.com/npmx-dev/npmx.dev/blob/main/test/nuxt/a11y.spec.ts): uses axe in component tests. Our project keeps its Playwright-only policy and scans complete pages without disabling page-level landmark rules.
- [Next.js hydration regression tests](https://github.com/vercel/next.js/blob/canary/test/development/acceptance/hydration-error.test.ts): deliberately introduces server/client differences and asserts diagnostics. We use a changed server response to exercise the real Vue detector.
- [Playwright accessibility guide](https://playwright.dev/docs/accessibility-testing): recommends `@axe-core/playwright`, scanning after revealing interactive states, and combining automation with manual testing.
