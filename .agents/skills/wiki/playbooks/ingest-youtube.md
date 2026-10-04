# Capture a YouTube source

Use for an authorized video capture. Inspect metadata to distinguish talk, tutorial, podcast and other video. For an episode, continue with [Podcast](ingest-podcast.md); retain the original video URL.

1. Use [source extraction](../../wiki-extract-source/SKILL.md) to normalize video identity, inspect duplicates and obtain available metadata/captions. If a source exists, read it and preserve its ID and annotations.
2. Inspect the actual transcript and relevant supplied slides. For a talk, extract the argument, examples and limitations. For a tutorial, extract the technique and assumptions; label reconstructed code. Record the material and coverage in raw provenance.
3. Without usable transcript or equivalent supplied evidence, save only an explicitly pending source when capture was requested. Do not infer content from its title. Tell the user what material would enable completion.
4. Read related notes using [connection discovery](../../wiki-connect-notes/SKILL.md). Reuse existing concepts, retain disagreements and create a separate insight only for a supported synthesis.
5. Write or update the source using the [note contract](../references/note-contract.md). Set `resourceType: youtube` for talks and tutorials. Follow [validation](../../wiki-validate/SKILL.md), including the appropriate private/public activity log.

Done means one stable source note, honest evidence coverage, justified knowledge changes and passing content checks. A second run with unchanged evidence produces no duplicate note or repeated log entry. A pending capture must be reported as pending.
