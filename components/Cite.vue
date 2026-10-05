<script setup lang="ts">
import { ref, unref } from 'vue'
import { useSlideContext } from '@slidev/client'

defineProps<{ number: number }>()
const { $page } = useSlideContext()
const root = ref<HTMLAnchorElement | null>(null)

function focusReference(number: number) {
  const page = root.value?.closest('.slidev-page')
  page?.querySelector<HTMLElement>(`[data-reference-number="${number}"]`)?.focus({ preventScroll: true })
}
</script>

<template>
  <a ref="root" class="citation-label" :href="`#reference-${unref($page)}-${number}`" :aria-label="`参考文献 ${number}`" @click.prevent="focusReference(number)">[{{ number }}]</a>
</template>

<style scoped>
.citation-label {
  font-size: 0.75em;
  line-height: 1;
  vertical-align: super;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
  margin-left: 0.15em;
}
</style>
