<script setup lang="ts">
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'
import AgendaList from '../components/AgendaList.vue'
import { getActiveSectionNumber, getAgendaOutline } from '../utils/agenda'

const { $frontmatter, $slidev, $page } = useSlideContext()
const items = computed(() => getAgendaOutline($slidev.nav.slides))
const active = computed(() => {
  const explicit = $frontmatter.agendaActive
  if (typeof explicit === 'string' || typeof explicit === 'number') return String(explicit)
  return getActiveSectionNumber(items.value, $slidev.nav.slides, $page.value)
})
</script>

<template>
  <div class="slidev-layout agenda">
    <h1>{{ $frontmatter.title || 'Agenda' }}</h1>
    <AgendaList v-if="items.length" :items="items" :active="active" class="agenda-outline" />
    <slot />
  </div>
</template>

<style scoped>
.agenda-outline {
  font-size: var(--watabegg-agenda-size);
  padding: 12px 24px 0;
}

.agenda > h1 {
  margin-bottom: 20px;
}
</style>
