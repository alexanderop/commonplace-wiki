---
noteId: testbare-software
title: 'Testbare Software'
description: 'Verhalten prüfen, das Nutzer tatsächlich erleben.'
kind: concept
updated: '2026-10-02'
tags: [Testing, Architektur]
---

## Eine beobachtbare Zusage
Ein Test beginnt mit einem möglichen Fehler. Wenn die App offline funktionieren soll, muss die Prüfung das Netzwerk abschalten und eine echte Seite neu laden.

## Die passende Grenze
Reine Regeln brauchen direkte Eingaben. Ein Browserablauf braucht einen Browser. [Dependency Injection](/notes/dependency-injection) hilft dabei, Abhängigkeiten explizit zu halten.

## Wissen und Belege
Auch eine technische Notiz braucht einen Beleg. Eine erfolgreiche Kompilierung ist kein Beweis für die Bedienbarkeit einer Oberfläche. [Quellenarbeit](/notes/llm-wiki-methode) folgt demselben Gedanken.
