<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { fitDiagram } from '../utils/figure'
import { useAvailableHeight } from '../utils/useAvailableHeight'

const props = withDefaults(defineProps<{ height?: number; maxScale?: number }>(), {
  height: 260,
  maxScale: 1,
})
const root = ref<HTMLElement | null>(null)
const height = useAvailableHeight(root, computed(() => props.height))
let resize: ResizeObserver | undefined
let frame = 0
let mounted = false
const observers = new Map<Node, MutationObserver>()

function schedule() {
  if (!mounted || frame) return
  frame = requestAnimationFrame(() => {
    frame = 0
    fit()
  })
}

function inspect(node: HTMLElement | ShadowRoot) {
  if (!observers.has(node)) {
    const observer = new MutationObserver(schedule)
    observer.observe(node, { childList: true, subtree: true, attributes: true, attributeFilter: ['viewBox', 'width', 'height', 'style'] })
    observers.set(node, observer)
  }
  const svgs = [...node.querySelectorAll<SVGSVGElement>('svg[viewBox]')]
  for (const child of node.querySelectorAll('*')) {
    if (child.shadowRoot) svgs.push(...inspect(child.shadowRoot))
  }
  return svgs
}

function fit() {
  const element = root.value
  if (!element) return
  for (const svg of inspect(element)) {
    const viewBox = svg.viewBox.baseVal
    const size = fitDiagram(viewBox.width, viewBox.height, element.clientWidth, element.clientHeight, props.maxScale)
    for (const [name, value] of Object.entries(size)) {
      const text = String(value)
      if (svg.getAttribute(name) !== text) svg.setAttribute(name, text)
    }
    if (svg.style.maxWidth !== 'none') svg.style.maxWidth = 'none'
    if (svg.style.display !== 'block') svg.style.display = 'block'
  }
}

onMounted(() => {
  mounted = true
  resize = new ResizeObserver(schedule)
  if (root.value) resize.observe(root.value)
  schedule()
})
watch(() => props.maxScale, schedule)
onUnmounted(() => {
  mounted = false
  cancelAnimationFrame(frame)
  resize?.disconnect()
  for (const observer of observers.values()) observer.disconnect()
})
</script>

<template>
  <div ref="root" class="diagram-frame" :style="{ height: `${height}px` }">
    <slot />
  </div>
</template>

<style scoped>
.diagram-frame {
  display: grid;
  place-items: center;
  min-height: 0;
  margin: 12px 0;
  line-height: 0;
}

.diagram-frame :deep(.mermaid) {
  line-height: 0;
}

.diagram-frame :deep(pre) {
  max-height: 100%;
  overflow: auto;
  line-height: 1.4;
}
</style>
