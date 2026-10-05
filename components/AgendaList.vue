<script setup lang="ts">
import type { AgendaItem } from '../utils/agenda'
import SectionNumber from './SectionNumber.vue'

defineProps<{ items: AgendaItem[]; active?: string }>()
</script>

<template>
  <ol class="agenda-list">
    <li v-for="item in items" :key="item.number" class="agenda-item">
      <div
        class="agenda-row"
        :class="{ 'is-active': active === item.number }"
        :aria-current="active === item.number ? 'step' : undefined"
      >
        <SectionNumber :number="item.number" />
        <span>{{ item.title }}</span>
      </div>
    </li>
  </ol>
</template>

<style scoped>
.agenda-list {
  --section-number-size: var(--watabegg-agenda-badge-size);
  display: grid;
  gap: 24px;
  list-style: none;
  padding: 0;
  margin: 0;
}

.agenda-item {
  margin: 0;
  padding: 0;
}

.agenda-row {
  display: flex;
  align-items: center;
  gap: 18px;
  color: var(--slidev-theme-text);
  line-height: 1.35;
}

.agenda-row.is-active {
  font-weight: 600;
}
</style>
