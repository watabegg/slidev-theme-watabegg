<template>
  <div
    class="slidev-layout image-scroll"
    ref="wrapperRef"
    @wheel.prevent="onWheel"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @pointercancel="onPointerUp"
  >
    <div class="image-scroll__scroller" ref="scrollerRef">
      <img
        v-if="imageSrc"
        ref="imageRef"
        :src="imageSrc"
        alt="Scrollable background"
        class="image-scroll__image"
        :style="imageStyle"
        draggable="false"
        @load="onImageLoad"
      />
    </div>
    <div class="content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { useSlideContext } from '@slidev/client'

const { $frontmatter } = useSlideContext()

const imageSrc = computed(() => typeof $frontmatter.image === 'string'
  ? $frontmatter.image
  : '')

const wrapperRef = ref<HTMLElement | null>(null)
const scrollerRef = ref<HTMLElement | null>(null)
const imageRef = ref<HTMLImageElement | null>(null)

type ImageScrollFrontmatter = {
  offsetY?: number
}

const imageScrollOptions = computed<ImageScrollFrontmatter>(() => {
  const raw = $frontmatter.imageScroll
  if (raw && typeof raw === 'object') return raw as ImageScrollFrontmatter
  return {}
})

const offsetY = computed(() => {
  const raw = imageScrollOptions.value.offsetY ?? 0
  const value = Number(raw)
  return Number.isFinite(value) ? value : 0
})

const imageSize = reactive({ width: 0, height: 0 })
const wrapperSize = reactive({ width: 0, height: 0 })

const clamp = (val: number, min: number, max: number) => Math.min(max, Math.max(min, val))

const isTouching = ref(false)
const lastTouchY = ref(0)

const normalizeWheel = (event: WheelEvent) => {
  let { deltaY } = event
  if (event.deltaMode === 1) {
    deltaY *= 16
  } else if (event.deltaMode === 2) {
    deltaY *= wrapperSize.height || 1
  }
  return deltaY
}

const onWheel = (event: WheelEvent) => {
  const scroller = scrollerRef.value
  if (!scroller || !imageSrc.value) return
  scroller.scrollTop += normalizeWheel(event)
}

let resizeObserver: ResizeObserver | null = null

const onPointerDown = (event: PointerEvent) => {
  if (!imageSrc.value) return
  if (event.pointerType !== 'touch') return
  wrapperRef.value?.setPointerCapture(event.pointerId)
  isTouching.value = true
  lastTouchY.value = event.clientY
}

const onPointerMove = (event: PointerEvent) => {
  if (!isTouching.value || event.pointerType !== 'touch') return
  const scroller = scrollerRef.value
  if (!scroller) return
  const deltaY = event.clientY - lastTouchY.value
  scroller.scrollTop -= deltaY
  lastTouchY.value = event.clientY
  event.preventDefault()
}

const onPointerUp = (event: PointerEvent) => {
  if (event.pointerType !== 'touch') return
  isTouching.value = false
  wrapperRef.value?.releasePointerCapture(event.pointerId)
}

const scaledHeight = computed(() => {
  if (!imageSize.width || !imageSize.height || !wrapperSize.width) return 0
  return (imageSize.height * wrapperSize.width) / imageSize.width
})

const getRenderedImageHeight = () => {
  const image = imageRef.value
  if (!image) return 0
  const rect = image.getBoundingClientRect()
  return rect.height
}

const applyDefaultScroll = () => {
  const scroller = scrollerRef.value
  if (!scroller) return
  const renderedHeight = getRenderedImageHeight()
  const totalHeight = renderedHeight || scaledHeight.value
  if (!totalHeight) return
  const viewportHeight = scroller.clientHeight || wrapperSize.height
  const maxScroll = Math.max(0, totalHeight - viewportHeight)
  const desired = maxScroll / 2 + offsetY.value
  scroller.scrollTop = clamp(desired, 0, maxScroll)
}

const scheduleApplyDefaultScroll = () => {
  if (!imageSrc.value) return
  nextTick(() => {
    requestAnimationFrame(() => {
      applyDefaultScroll()
    })
  })
}

const onImageLoad = (event: Event) => {
  const target = event.target as HTMLImageElement
  imageSize.width = target.naturalWidth
  imageSize.height = target.naturalHeight
  scheduleApplyDefaultScroll()
}

const updateWrapperSize = () => {
  const rect = wrapperRef.value?.getBoundingClientRect()
  if (!rect) return
  wrapperSize.width = rect.width
  wrapperSize.height = rect.height
}

const imageStyle = computed(() => {
  if (!imageSize.width || !imageSize.height) return {}
  return {
    aspectRatio: `${imageSize.width} / ${imageSize.height}`,
  }
})

onMounted(() => {
  updateWrapperSize()
  if (imageRef.value?.complete && imageRef.value.naturalWidth) {
    imageSize.width = imageRef.value.naturalWidth
    imageSize.height = imageRef.value.naturalHeight
  }
  scheduleApplyDefaultScroll()
  if (wrapperRef.value) {
    resizeObserver = new ResizeObserver(() => {
      updateWrapperSize()
      scheduleApplyDefaultScroll()
    })
    resizeObserver.observe(wrapperRef.value)
  }
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  resizeObserver = null
})

watch(imageSrc, () => {
  imageSize.width = 0
  imageSize.height = 0
  if (scrollerRef.value) scrollerRef.value.scrollTop = 0
})

watch([scaledHeight, offsetY], () => {
  scheduleApplyDefaultScroll()
})
</script>

<style scoped>
.slidev-layout.image-scroll {
  position: relative;
  height: 100%;
  padding: 0;
  overflow: hidden;
  touch-action: none;
}

.image-scroll__scroller {
  position: absolute;
  inset: 0;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-gutter: stable;
  overscroll-behavior: contain;
}

.image-scroll__image {
  display: block;
  width: 100%;
  max-width: none;
  pointer-events: none;
  user-select: none;
}

.content {
  position: relative;
  z-index: 1;
  height: 100%;
  padding: var(--watabegg-slide-y) var(--watabegg-slide-x);
  box-sizing: border-box;
}
</style>
