# Wiki application

Commands from this directory run the application package. Root commands also check the UI package and run app journeys. Paths below are relative to apps/wiki.

- app/ owns Nuxt pages, domain components, translations and browser preferences.
- shared/ owns schemas, content/ owns authored Markdown, scripts/ owns compilation and preview.
- Import reusable primitives through @commonplace/ui public exports, not package source paths or reka-ui directly.
- Keep domain-specific layouts and graph rendering in the app. Keep reusable styling and accessibility behavior in packages/ui.
- Preserve the public/private build boundary and base-path/offline behavior.
