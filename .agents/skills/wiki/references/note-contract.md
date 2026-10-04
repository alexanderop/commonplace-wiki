# Authored note contract

The authoritative fields and allowed relation kinds live in [shared/wiki.ts](../../../../apps/wiki/shared/wiki.ts); the supported components and Markdown checks live in [compile-wiki.ts](../../../../apps/wiki/scripts/compile-wiki.ts). Read them before adding metadata or components. Do not introduce fields that the compiler silently strips.

A new real source uses this shape (replace the example values):

```yaml
---
noteId: example-source
title: Example source
description: A concise supported claim, or an explicit pending-capture description.
kind: source
resourceType: youtube
sourceUrl: https://www.youtube.com/watch?v=VIDEO_ID
author: Known creator
updated: 2026-10-04
tags: []
demo: false
relations: []
---
```

Use the current date for a real change. Omit unknown author/sourceUrl fields. Keep filenames equal to stable note IDs; do not rename an existing note from a changed source title. `resourceType` applies only to source notes. Use `podcast` for an episode even if its URL is YouTube, and `other` for unsupported/uncertain media. Concepts and insights have their own `kind` and cite supporting source notes.

In the body record:

- **Evidence and coverage:** what was inspected, its source URL and locations, and whether coverage is complete, partial or metadata-only.
- **Source account:** supported claims and reasoning. For metadata-only capture, say analysis is pending and omit takeaways.
- **Interpretation:** clearly attributed user observations or agent synthesis, if useful.
- **Connections:** explained links to existing notes, when justified.
- **Limitations:** unavailable transcript, excerpts only, unclear attribution or conflicting evidence.

These are content requirements, not mandatory identical headings for every medium. Store acquisition details in ignored raw provenance. Public notes must not contain private raw paths or private IDs. Use `[Topic](/notes/stable-id)` links. Preserve useful Comark components already supported by the renderer; do not invent new tags during ingestion.
