<script setup lang="ts">
import { Button as UiButton } from '@commonplace/ui/button'
const { t } = useI18n()
import ForceGraph, { type NodeObject } from 'force-graph'
import type { KnowledgeGraph, GraphNode } from '~/utils/knowledge'
const props = withDefaults(defineProps<{ graph: KnowledgeGraph; active?: string; height?: number; compact?: boolean }>(), { height: 320 })
const emit = defineEmits<{ open: [id: string] }>()
type VisualNode = NodeObject & GraphNode
const host = ref<HTMLElement>()
let graph: ForceGraph<VisualNode> | undefined
let resize: ResizeObserver | undefined
let hovered: string | undefined
let themeObserver: MutationObserver | undefined
let colors = { paper: '#191b19', ink: '#eeeee5', muted: '#a5ab9e', terra: '#e49a79', source: '#8eb29b', insight: '#b3a2d0', line: '#565f51', label: '#191b19e8', halo: '#e49a7926' }
function updateColors() {
  const style = getComputedStyle(document.documentElement)
  const value = (name: string) => style.getPropertyValue(name).trim()
  colors = { paper: value('--paper'), ink: value('--ink'), muted: value('--muted'), terra: value('--terra'), source: value('--source'), insight: value('--insight'), line: value('--graph-line'), label: value('--graph-label'), halo: value('--graph-halo') }
  graph?.linkColor(() => colors.line)
}
const reducedMotion = ref(false)
function draw(node: VisualNode, context: CanvasRenderingContext2D, scale: number) {
  const active = node.id === props.active || node.id === hovered
  const adjacent = !hovered || props.graph.links.some(link => link.source === hovered && link.target === node.id || link.target === hovered && link.source === node.id) || hovered === node.id
  const x = node.x ?? 0; const y = node.y ?? 0
  context.globalAlpha = adjacent ? 1 : 0.22
  if (active) { context.beginPath(); context.arc(x, y, node.size + 6, 0, Math.PI * 2); context.fillStyle = colors.halo; context.fill() }
  context.beginPath(); context.arc(x, y, active ? node.size + 1 : node.size, 0, Math.PI * 2)
  context.fillStyle = node.kind === 'concept' ? colors.terra : colors[node.kind]; context.fill()
  context.strokeStyle = colors.paper; context.lineWidth = 1.3; context.stroke()
  if (!props.compact || active) {
    const fontSize = (active ? 12 : 10) / scale
    context.font = `${active ? 600 : 400} ${fontSize}px ui-monospace, monospace`
    context.textAlign = 'center'; context.textBaseline = 'top'
    const label = node.title.length > 26 ? `${node.title.slice(0, 25)}…` : node.title
    const width = context.measureText(label).width
    context.fillStyle = colors.label; context.fillRect(x - width / 2 - 3, y + node.size + 4, width + 6, fontSize + 4)
    context.fillStyle = active ? colors.terra : colors.muted; context.fillText(label, x, y + node.size + 5)
  }
  context.globalAlpha = 1
}
function update() {
  if (!graph) return
  graph.graphData({ nodes: props.graph.nodes.map((node, index) => ({ ...node, x: Math.cos(index * 2.399) * (25 + index * 9), y: Math.sin(index * 2.399) * (25 + index * 9) })), links: props.graph.links.map(link => ({ ...link })) })
  graph.d3ReheatSimulation()
}
onMounted(async () => {
  await nextTick()
  if (!host.value) return
  updateColors()
  themeObserver = new MutationObserver(updateColors)
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
  reducedMotion.value = matchMedia('(prefers-reduced-motion: reduce)').matches
  graph = new ForceGraph<VisualNode>(host.value)
    .width(host.value.clientWidth).height(props.height)
    .backgroundColor('rgba(0,0,0,0)').nodeLabel(node => { const label = document.createElement('span'); label.textContent = node.title; return label }).nodeVal(node => node.size)
    .nodeCanvasObject(draw).nodePointerAreaPaint((node, color, context) => { context.fillStyle = color; context.beginPath(); context.arc(node.x ?? 0, node.y ?? 0, node.size + 8, 0, 2 * Math.PI); context.fill() })
    .linkColor(() => colors.line).linkWidth(0.7)
    .onNodeClick(node => emit('open', node.id))
    .onNodeHover(node => { hovered = node?.id; if (host.value) host.value.style.cursor = node ? 'pointer' : 'grab' })
    .cooldownTicks(reducedMotion.value ? 0 : 70).warmupTicks(80).enableNodeDrag(!props.compact)
    .onEngineStop(() => graph?.zoomToFit(reducedMotion.value ? 0 : 300, props.compact ? 22 : 65))
  resize = new ResizeObserver(() => { if (host.value) graph?.width(host.value.clientWidth) })
  resize.observe(host.value)
  update()
  graph.zoomToFit(0, props.compact ? 22 : 65)
})
watch(() => props.graph, update)
onBeforeUnmount(() => { resize?.disconnect(); themeObserver?.disconnect(); graph?._destructor() })
</script>
<template><div class="graph-surface" :class="{ 'graph-compact': compact }"><div ref="host" role="img" :aria-label="t('graphAccessible')" :style="{ height: `${height}px` }" /><UiButton variant="plain" size="inherit" v-if="!compact" class="graph-fit quiet-button" @click="graph?.zoomToFit(reducedMotion ? 0 : 400, 65)" :aria-label="t('centerGraph')">⊙ {{ t('center') }}</UiButton></div></template>
