import { onMounted, onUnmounted, onUpdated, ref, watch, type Ref } from 'vue'

/** Reserve the space occupied by later paragraphs and the slide's bottom padding. */
export function useAvailableHeight(element: Ref<HTMLElement | null>, maximum: Ref<number>) {
  const height = ref(maximum.value)
  let resize: ResizeObserver | undefined
  let content: MutationObserver | undefined
  let tokens: MutationObserver | undefined
  let frame = 0
  let mounted = false

  function measure() {
    const root = element.value
    const layout = root?.closest<HTMLElement>('.slidev-layout')
    if (!root || !layout?.offsetHeight) return
    const bounds = layout.getBoundingClientRect()
    const scale = bounds.height / layout.offsetHeight
    if (!scale) return

    let last: HTMLElement = root
    let block: HTMLElement = root
    while (block !== layout && block.parentElement) {
      for (let next = block.nextElementSibling; next; next = next.nextElementSibling) {
        if (!(next instanceof HTMLElement)) continue
        const style = getComputedStyle(next)
        if (style.display === 'none' || ['absolute', 'fixed'].includes(style.position)) continue
        last = next
      }
      block = block.parentElement
    }

    const bottom = bounds.bottom - Number.parseFloat(getComputedStyle(layout).paddingBottom) * scale
    const after = last.getBoundingClientRect().bottom
    const margin = Number.parseFloat(getComputedStyle(last).marginBottom) || 0
    const available =
      root.getBoundingClientRect().height / scale + (bottom - after) / scale - margin
    const nextHeight = Math.max(0, Math.min(maximum.value, available))
    if (Math.abs(height.value - nextHeight) > 0.5) height.value = nextHeight
  }

  function schedule() {
    if (!mounted || frame) return
    frame = requestAnimationFrame(() => {
      frame = 0
      measure()
    })
  }

  onMounted(() => {
    mounted = true
    const root = element.value
    const layout = root?.closest<HTMLElement>('.slidev-layout')
    if (!root || !layout) return
    resize = new ResizeObserver(schedule)
    for (const node of [layout, root, ...layout.children, ...root.children]) resize.observe(node)
    content = new MutationObserver(schedule)
    content.observe(layout, { childList: true, characterData: true, subtree: true })
    tokens = new MutationObserver(schedule)
    for (const node of [layout, layout.closest('.slidev-page')]) {
      if (node) tokens.observe(node, { attributes: true, attributeFilter: ['style', 'class'] })
    }
    void document.fonts.ready.then(schedule)
    schedule()
  })
  watch(maximum, schedule)
  onUpdated(schedule)
  onUnmounted(() => {
    mounted = false
    cancelAnimationFrame(frame)
    resize?.disconnect()
    content?.disconnect()
    tokens?.disconnect()
  })
  return height
}
