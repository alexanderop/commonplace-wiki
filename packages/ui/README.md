# @commonplace/ui

Owned Vue components with Reka UI behavior and plain CSS. No shadcn-vue package, generator, React or Tailwind dependency.

Each component has a directory, its Vue source and a public `index.ts`. Import a component group (`@commonplace/ui/button`) or the root barrel (`@commonplace/ui`). Import `@commonplace/ui/styles.css` once in the app. Vue source is exported directly for the consumer's bundler; there is no separate distribution build.

```vue
<script setup lang="ts">
import { Button } from '@commonplace/ui/button'
</script>
<template><Button variant="solid" size="sm">Save</Button></template>
```

- Button: Reka Primitive; `solid`, `outline`, `ghost`, `plain`; `sm`, `md`, `icon`, `inherit`; supports `as-child` composition.
- Dialog: Reka root/trigger/title/description/close with our styled, portalled `DialogContent`. Pass an accessible title and either a description or `:aria-describedby="undefined"`.
- Input: native input, string `v-model`, exposed `focus()`.
- NativeSelect: native select with forwarded attributes/events and option slots. Native keyboard behavior is intentional.
- Badge: neutral/accent labels.

Dark/light tokens belong in `src/styles/tokens.css`. The package accepts content through props and slots; it has no translations, storage, routing, Nuxt globals or knowledge-domain imports. App components own business behavior.

`pnpm --filter @commonplace/ui typecheck` checks the package independently. Root Playwright journeys verify its real application integration, dialog keyboard behavior, themes and locale switching.
