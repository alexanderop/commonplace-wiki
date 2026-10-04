---
noteId: local-first
title: 'Local-first Software'
description: 'Inhalte gehören zuerst auf dein Gerät. Das Netz erweitert ihre Möglichkeiten.'
kind: concept
updated: '2026-10-02'
tags: [Offline, Architektur]
---

## Daten bleiben erreichbar
Ein lokaler Wissensbestand lässt sich auch ohne Verbindung lesen. Für dieses Wiki bleiben die Markdown-Dateien im Repository. Die Web-App hält einen erzeugten Lesestand offline bereit.

## Offline ist ein Produktverhalten
Die Startseite aus dem Cache zu laden reicht nicht. Auch ein noch nicht geöffneter Artikel, die Suche und der Graph müssen funktionieren.

## Dateien und Browser
[Markdown als Gedächtnis](/notes/markdown) bietet eine dauerhafte Form. Die PWA ist eine zusätzliche Leseansicht. Ihr Cache ist kein Ersatz für ein Backup der Dateien.

::source-reference{source="nuxt-content"}
Nuxt Content kann Inhalte statisch veröffentlichen und im Browser abfragen.
::
