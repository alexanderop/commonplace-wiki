# Commonplace wiki

This directory is a pnpm workspace with a Nuxt 4 app and an owned Vue UI package. Use pnpm. Preserve all parent app files.

- `apps/wiki/content/public` and `apps/wiki/content/private` own authored Markdown. Never edit generated JSON as source.
- `apps/wiki/scripts/compile-wiki.ts` validates metadata, parses with Comark, derives links and selects the publication audience before Nuxt Content sees any data.
- `apps/wiki/shared/wiki.ts` owns validated content types. Use Nuxt's `#shared` alias from app code.
- Nuxt Content reads `apps/wiki/.generated/<audience>` as a data collection. Comark owns rendering through `WikiDocument`.
- `apps/wiki/app/utils/knowledge.ts` owns search and relationships. Graph rendering receives copies and never mutates the knowledge index.
- `KnowledgeGraph.client.vue` owns its canvas, simulation and resize lifecycle.
- `packages/ui` owns reusable components and dark/light tokens. Use its public exports from the app; Reka UI imports belong only in this package.
- Use plain CSS and the existing paper/ink/terracotta design tokens.
- `apps/wiki` owns application behavior, translations and persistence; never import it from the UI package.
- Use only Playwright end-to-end tests with executable Gherkin scenarios. Do not add Vitest.
- Run `pnpm verify` and `pnpm test:compat`. Tests target the production output and real service workers. The default suite must work with any valid Markdown collection, including an empty one. Example-specific checks belong under @demo and run via pnpm test:demo.
- Verify a nested base path when changing routing or offline caching.
- Public output must not include private data in HTML, payloads, search, graph or database artifacts.
- Demo content must not imply actual viewing of a talk or invent quotes/timestamps.

## Maintaining the knowledge base

When the user asks to ingest a source:

1. Read the supplied source or a file in `raw/`; preserve original source files. If a video has no transcript, report that gap rather than inventing what was said.
2. Read relevant existing notes before adding a topic. Reuse stable note IDs and update existing summaries when the source adds evidence.
3. Default new personal knowledge to `apps/wiki/content/private`. Publish only when the user explicitly requests public content. Public notes may not reference private notes.
4. Create a `kind: source` note with `sourceUrl` and `author` when known, a concise summary, limitations and links to related topic notes. Set `demo: false`. Mark interpretations as interpretations; quotes and timestamps need source evidence.
5. Add or revise concept/insight pages where useful. Preserve disagreements and link supporting or contradictory source notes instead of silently replacing claims.
6. Append public changes to `docs/wiki-log.md`; log private activity only in ignored `raw/wiki-log.md` so private IDs and source URLs never enter the public repository. Run `pnpm content` for the intended audience and inspect the Git diff. Commit or publish only when requested.

For questions, search the Markdown catalog and answer with note/source references. Save an answer as an insight when requested. For maintenance, inspect orphan notes, broken references, duplicate topics, stale claims and contradictions; distinguish mechanical link errors from claims requiring new evidence. The app derives its catalog and backlinks, so there is no second hand-maintained index.

For source notes, assign `resourceType`: `blog`, `youtube`, `podcast`, `film`, `book`, `documentation` or `other`. Classify the actual source medium, not the topic being discussed. Use `other` when unknown. Do not assign a resource type to concepts or insights. Keep the source URL and author when available; do not invent examples to fill empty resource categories.

## Page quality gates

- `tests/support/generate-page-audits.mjs` derives page scenarios from production HTML. Keep route coverage automatic and compatible with empty/custom Markdown collections.
- Page audits scan the full DOM with axe, including search and mobile navigation states. Preserve contrast checks; fix violations instead of suppressing them.
- `tests/steps/browser-health.ts` observes errors before navigation and fails all scenarios on hydration mismatches or uncaught browser errors. Guard scenarios prove detection with intentional faults in isolated pages.
- Wait for `data-hydrated` before post-hydration interaction; do not replace readiness with fixed sleeps.

## Wiki agent workflows

For capture, wiki questions, connections and maintenance, use [.agents/skills/wiki/SKILL.md](.agents/skills/wiki/SKILL.md). Skills live in this repository and are scoped to wiki work; do not install global hooks. The router loads the relevant playbook and shared principles. Run `pnpm skills:check` after editing these resources. Private capture does not authorize publishing or committing.
