import type { Note, NoteKind } from '#shared/wiki'

export interface GraphNode { id: string; title: string; kind: NoteKind; size: number }
export interface GraphEdge { source: string; target: string }
export interface KnowledgeGraph { nodes: GraphNode[]; links: GraphEdge[] }
const normalize = (text: string) => text.toLocaleLowerCase('de').normalize('NFD').replace(/[\u0300-\u036f]/g, '')

export function createKnowledge(notes: readonly Note[]) {
  const byId = new Map(notes.map(note => [note.noteId, note]))
  const edges = notes.flatMap(note => note.relations.map(link => ({ source: note.noteId, target: link.target })))
  const links = edges.filter((edge, index) => edges.findIndex(other => [other.source, other.target].sort().join('|') === [edge.source, edge.target].sort().join('|')) === index)
  function neighbors(id: string) { return notes.filter(note => note.noteId !== id && links.some(link => link.source === id && link.target === note.noteId || link.target === id && link.source === note.noteId)) }
  return {
    notes,
    get: (id: string) => byId.get(id),
    neighbors,
    backlinks: (id: string) => notes.filter(note => note.relations.some(link => link.target === id)),
    search(query: string) {
      const terms = normalize(query.trim()).split(/\s+/).filter(Boolean)
      if (!terms.length) return [...notes].sort((a, b) => b.updated.localeCompare(a.updated))
      return notes.map(note => {
        const title = normalize(note.title)
        const tags = normalize(note.tags.join(' '))
        const text = normalize(`${note.description} ${note.searchText}`)
        const score = terms.every(term => `${title} ${tags} ${text}`.includes(term))
          ? terms.reduce((total, term) => total + (title.includes(term) ? 12 : 0) + (tags.includes(term) ? 6 : 0) + (text.includes(term) ? 1 : 0), 0) : 0
        return { note, score }
      }).filter(item => item.score > 0).sort((a, b) => b.score - a.score).map(item => item.note)
    },
    graph(around?: string, kind?: NoteKind): KnowledgeGraph {
      const nearby = around ? new Set([around, ...neighbors(around).map(note => note.noteId)]) : undefined
      const selected = notes.filter(note => (!nearby || nearby.has(note.noteId)) && (!kind || note.kind === kind))
      const ids = new Set(selected.map(note => note.noteId))
      return {
        nodes: selected.map(note => ({ id: note.noteId, title: note.title, kind: note.kind, size: Math.min(7, 3 + links.filter(link => link.source === note.noteId || link.target === note.noteId).length * 0.4) })),
        links: links.filter(link => ids.has(link.source) && ids.has(link.target)),
      }
    },
  }
}
