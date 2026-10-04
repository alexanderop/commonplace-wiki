# UI package

- Own reusable presentation, design tokens and accessible primitives here.
- Use Vue 3, strict TypeScript, Reka UI and plain CSS. Do not install shadcn-vue or React.
- Keep one directory per component with named exports from its index.ts.
- Do not import apps/wiki, Nuxt aliases, content models, application translations or browser storage.
- Use explicit Vue imports; this package must typecheck without Nuxt auto-imports.
- Use slots/props for labels. Keep keyboard and focus behavior supplied by Reka intact.
- Verify changes through package typechecking and the root Playwright/Gherkin journeys.
