<script setup lang="ts">
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'
import SectionNumber from '../components/SectionNumber.vue'
import { getAgendaOutline, getSectionItem } from '../utils/agenda'

const { $frontmatter, $slidev, $page } = useSlideContext()
const slide = computed(() => $slidev.nav.slides.find((route) => route.no === $page.value)?.meta?.slide)
const item = computed(() =>
  getSectionItem(getAgendaOutline($slidev.nav.slides), $frontmatter, slide.value?.title, $page.value),
)
const title = computed(() => $frontmatter.title || slide.value?.title || item.value?.title)
</script>

<template>
  <div class="slidev-layout section">
    <div class="section-content">
      <div class="section-heading">
        <SectionNumber v-if="item" :number="item.number" />
        <h1 v-if="$frontmatter.title || !slide?.title">{{ title }}</h1>
        <div v-else class="section-title"><slot /></div>
      </div>
      <div v-if="$frontmatter.title" class="section-body"><slot /></div>
    </div>
  </div>
</template>

<style scoped>
.slidev-layout.section {
  position: relative;
  display: grid;
  place-items: center;
}

.section-content {
  width: min(100%, 780px);
}

.section-heading {
  display: flex;
  align-items: center;
  gap: 24px;
  padding-bottom: 24px;
  border-bottom: 2px solid var(--slidev-theme-primary);
  font-size: var(--watabegg-section-size);
}

.section-heading :deep(h1) {
  font-size: inherit;
  line-height: 1.3;
  color: var(--slidev-theme-text);
  border: none;
  padding: 0;
  margin: 0;
}

.section-title {
  flex: 1;
  min-width: 0;
}

.section-body:empty {
  display: none;
}
</style>
