# Contributing

Use Node 24 and pnpm 10. Run `pnpm install --frozen-lockfile`, `pnpm verify`, and `pnpm test:compat` from the root. Install Chromium and Firefox with `pnpm exec playwright install chromium firefox` first.

Keep the UI package independent of Nuxt and wiki content. Use its public exports from the app. Add behavior checks as executable Gherkin/Playwright journeys. Check offline behavior against the production build, not the development server.

The normal browser suite works with your current Markdown collection. `pnpm test:demo` additionally runs the original example-specific journeys; use it when the twelve starter notes are intact. CI tests both `/` and `/wiki/` and injects a synthetic private marker to check the publication boundary.

Do not commit personal notes, source inbox files, credentials or generated output. Keep pull requests focused and explain the user-visible behavior and validation.
