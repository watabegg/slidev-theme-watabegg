<template>
  <div class="slidev-layout cover" :style="cssVars">
    <div class="content">
      <h1 v-if="$frontmatter.title">{{ $frontmatter.title }}</h1>
      <h2 v-if="$frontmatter.subtitle">{{ $frontmatter.subtitle }}</h2>
    </div>
    <div v-if="$frontmatter.date" class="date">
      {{ $frontmatter.date }}
    </div>
    <div v-if="$frontmatter.author" class="author">
      {{ $frontmatter.author }}
    </div>
    <ThemeWave />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'
import ThemeWave from '../components/ThemeWave.vue'

import { useActiveThemePalette } from '../utils/useThemePalette'

const { $frontmatter, $slidev } = useSlideContext()

const { palette: currentPalette } = useActiveThemePalette({
  slidevConfigs: $slidev?.configs as Record<string, unknown> | undefined,
  slideValue: () => $frontmatter.color,
})

const cssVars = computed(() => ({
  '--slidev-theme-primary': currentPalette.value.primary,
  '--cover-gradient-start': currentPalette.value.gradientStart,
  '--cover-gradient-end': currentPalette.value.gradientEnd,
  '--cover-accent': currentPalette.value.accent,
}))
</script>

<style scoped>
.content {
  z-index: 10;
  position: relative;
}

.default {
  margin-top: 2rem;
  color: white;
}

</style>
