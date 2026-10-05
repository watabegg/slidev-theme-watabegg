<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, unref, watch } from 'vue'
import { useSlideContext } from '@slidev/client'
import { formatReferences, type SlideReference } from '../utils/references'

const props = defineProps<{ items: SlideReference[] }>()
const { $page } = useSlideContext()
const root = ref<HTMLElement | null>(null)
const content = computed(() => {
  try {
    return { items: formatReferences(props.items), error: '' }
  } catch (error) {
    return { items: [], error: error instanceof Error ? error.message : String(error) }
  }
})
let page: HTMLElement | null | undefined
let resize: ResizeObserver | undefined

function reserve() {
  if (root.value && page) page.style.setProperty('--watabegg-references-space', `${root.value.offsetHeight + 12}px`)
}

onMounted(() => {
  page = root.value?.closest<HTMLElement>('.slidev-page')
  resize = new ResizeObserver(reserve)
  if (root.value) resize.observe(root.value)
  reserve()
})
watch(content, () => nextTick(reserve))
onUnmounted(() => {
  resize?.disconnect()
  page?.style.removeProperty('--watabegg-references-space')
})
</script>

<template>
  <aside ref="root" class="slide-references" aria-label="参考文献">
    <p v-if="content.error" class="reference-error">SlideReferences: {{ content.error }}</p>
    <div v-for="item in content.items" :key="item.number" :id="`reference-${unref($page)}-${item.number}`" class="reference-entry" :data-reference-number="item.number" tabindex="-1">
      <span class="reference-number">[{{ item.number }}]</span>
      <span>{{ item.text }}<template v-if="item.url">. <a :href="item.url" target="_blank" rel="noopener noreferrer">{{ item.url }}</a></template></span>
    </div>
  </aside>
</template>

<style scoped>
.slide-references {
  position: absolute;
  bottom: var(--watabegg-footer-space);
  left: var(--watabegg-slide-x);
  right: var(--watabegg-slide-x);
  color: #757575;
  font-size: 11px;
  line-height: 1.4;
}

.reference-entry {
  display: grid;
  grid-template-columns: 2.5em minmax(0, 1fr);
  gap: 4px;
  margin-top: 3px;
  overflow-wrap: anywhere;
}

.reference-number {
  font-variant-numeric: tabular-nums;
}

.slide-references a {
  color: inherit;
}

.reference-error {
  margin: 0;
  color: #b42318;
}

.reference-entry:focus-visible {
  outline: 1px solid var(--slidev-theme-primary);
  outline-offset: 2px;
}
</style>
