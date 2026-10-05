<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useAvailableHeight } from '../utils/useAvailableHeight'

interface FigureImage {
  src: string
  alt: string
}

const props = withDefaults(defineProps<{ images: FigureImage[]; caption?: string; height?: number }>(), {
  caption: '',
  height: 380,
})
const root = ref<HTMLElement | null>(null)
const plots = ref<HTMLElement | null>(null)
const height = useAvailableHeight(root, computed(() => props.height))
const side = ref(0)
const validCount = computed(() => props.images.length >= 2 && props.images.length <= 4)
let resize: ResizeObserver | undefined

function measure() {
  const element = plots.value
  if (!element || !validCount.value) return
  const gap = Number.parseFloat(getComputedStyle(element).gap)
  side.value = Math.max(0, Math.min(element.clientHeight, (element.clientWidth - gap * (props.images.length - 1)) / props.images.length))
}

onMounted(() => {
  resize = new ResizeObserver(measure)
  if (plots.value) resize.observe(plots.value)
  measure()
})
watch(() => props.images.length, () => nextTick(measure))
onUnmounted(() => resize?.disconnect())
</script>

<template>
  <div v-if="!validCount" class="figure-error">FigureGridには画像を2〜4枚指定してください。</div>
  <div v-else ref="root" class="figure-grid" :style="{ height: `${height}px` }">
    <div v-if="$slots.before" class="figure-copy"><slot name="before" /></div>
    <figure class="figure-group">
      <div ref="plots" class="figure-images" :style="{ '--figure-side': `${side}px` }">
        <img
          v-for="(image, index) in images"
          :key="index"
          :src="image.src"
          :alt="image.alt"
          class="figure-image"
        />
      </div>
      <figcaption v-if="caption || $slots.caption" class="figure-caption">
        <slot name="caption">{{ caption }}</slot>
      </figcaption>
    </figure>
    <div v-if="$slots.after" class="figure-copy"><slot name="after" /></div>
  </div>
</template>

<style scoped>
.figure-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 0;
}

.figure-copy {
  flex: none;
}

.figure-copy :deep(p),
.figure-caption :deep(p) {
  margin: 0;
}

.figure-group {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 8px;
  min-height: 0;
  margin: 0;
}

.figure-images {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: 16px;
  min-height: 0;
}

.figure-image {
  flex: none;
  width: var(--figure-side);
  height: var(--figure-side);
  object-fit: contain;
}

.figure-caption {
  flex: none;
  color: var(--slidev-theme-text-secondary);
  font-size: var(--watabegg-small-text-size);
  line-height: 1.35;
  text-align: center;
}
</style>
