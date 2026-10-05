<script setup lang="ts">
import { computed, ref, unref, watchPostEffect } from 'vue'
import { useSlideContext } from '@slidev/client'

import ThemeFooter from './components/ThemeFooter.vue'
import { getDensityVariables, getPresentationSettings } from './utils/presentation'
import { useActiveThemePalette } from './utils/useThemePalette'

const { $frontmatter, $slidev, $page, $renderContext } = useSlideContext()
const layer = ref<HTMLElement | null>(null)
const settings = computed(() => getPresentationSettings($frontmatter, $slidev.configs))
const { palette } = useActiveThemePalette({
  slidevConfigs: $slidev.configs,
  slideValue: () => $frontmatter.color,
})

// Scope tokens to this slide, including overview thumbnails and exported pages.
watchPostEffect(() => {
  const page = layer.value?.parentElement
  if (!page) return

  const variables = {
    ...getDensityVariables(settings.value.density),
    '--slidev-theme-primary': palette.value.primary,
    '--cover-gradient-start': palette.value.gradientStart,
    '--cover-gradient-end': palette.value.gradientEnd,
    '--cover-accent': palette.value.accent,
    '--watabegg-footer-space': settings.value.footer.visible ? '36px' : '24px',
  }
  for (const [name, value] of Object.entries(variables)) page.style.setProperty(name, value)
  page.dataset.density = settings.value.density
})
</script>

<template>
  <div ref="layer" class="watabegg-slide-layer">
    <ThemeFooter
      v-if="settings.footer.visible && !['slide', 'presenter'].includes(unref($renderContext))"
      :date="settings.footer.date"
      :text="settings.footer.text"
      :page="unref($page)"
      :total="$slidev.nav.total"
      :page-number="settings.footer.pageNumber"
    />
  </div>
</template>

<style scoped>
.watabegg-slide-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 20;
}

</style>
