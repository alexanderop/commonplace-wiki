# Capture a podcast episode

Use [source extraction](../../wiki-extract-source/SKILL.md) to identify the episode and check duplicates across known platform URLs. Prefer an available transcript, otherwise supplied listening notes. Show notes establish their own contents; they are not a full transcript.

Distinguish host, guest and quoted third parties. Attribute disputed claims to speakers. Record episode/show identity and alternate source URLs in the body without creating a new author/profile subsystem. Preserve time offsets only when the inspected material supplies them. If speaker attribution is uncertain, say so.

Use `kind: source` and `resourceType: podcast`, including episodes hosted on YouTube. With metadata alone, save an explicit pending capture. Use [connection discovery](../../wiki-connect-notes/SKILL.md), the [note contract](../references/note-contract.md), and [validation](../../wiki-validate/SKILL.md) to complete the authorized capture.
