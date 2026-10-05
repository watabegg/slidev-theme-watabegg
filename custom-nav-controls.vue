<script setup lang="ts">
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'

import { getWatabeggThemeConfig } from './utils/themeConfig'
import { toSafeUrl } from './utils/safeUrl'

const { $slidev } = useSlideContext()
const navigation = computed(() => {
  const value = getWatabeggThemeConfig($slidev.configs).navigation
  if (!value || typeof value !== 'object') return undefined
  const options = value as Record<string, unknown>
  const href = toSafeUrl(options.href)
  if (!href) return undefined
  return { href, label: typeof options.label === 'string' ? options.label : '発表一覧に戻る' }
})
</script>

<template>
  <a v-if="navigation" class="watabegg-back-link" :href="navigation.href" target="_top">
    <span aria-hidden="true">←</span> {{ navigation.label }}
  </a>
</template>

<style scoped>
.watabegg-back-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  font-size: 12px;
  white-space: nowrap;
  border-radius: 4px;
}

.watabegg-back-link:hover,
.watabegg-back-link:focus-visible {
  background: rgba(128, 128, 128, 0.15);
}
</style>
