---
noteId: dependency-injection
title: 'Dependency Injection'
description: 'Abhängigkeiten sichtbar machen, damit Verhalten nachvollziehbar und prüfbar bleibt.'
kind: concept
updated: '2026-10-03'
tags: [Architektur, Testing]
---

## Was braucht diese Funktion?
Eine Funktion kann Abhängigkeiten als Argumente erhalten. Dann ist erkennbar, ob sie Daten, eine Uhr oder einen HTTP-Client benötigt.

```ts
function greeting(name: string, hour: number) {
  return hour < 12 ? `Guten Morgen, ${name}` : `Hallo, ${name}`
}
```

## Der Zusammenhang mit Tests
Der Aufrufer entscheidet, welchen Wert er übergibt. Das erleichtert [testbare Software](/notes/testbare-software), ohne für jedes Beispiel ein Framework einzuführen.

## Eine Frage für deine Notizen
Welche Abhängigkeiten sind in deinem aktuellen Projekt unsichtbar? Ein kleiner Vergleich gehört als eigene [Erkenntnis](/notes/verbindungen-entdecken) ins Wiki.
