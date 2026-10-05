<script setup lang="ts">
defineProps<{
  date: string
  text: string
  page: number
  total: number
  pageNumber: boolean
}>()
</script>

<template>
  <footer class="watabegg-footer">
    <span class="footer-date">{{ date }}</span>
    <span class="footer-text">{{ text }}</span>
    <span v-if="pageNumber" class="footer-page">{{ page }} / {{ total }}</span>
  </footer>
</template>

<style scoped>
.watabegg-footer {
  position: absolute;
  bottom: 10px;
  left: var(--watabegg-slide-x);
  right: var(--watabegg-slide-x);
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: 12px;
  align-items: center;
  color: var(--slidev-theme-text-secondary);
  font-family: var(--slidev-font-family);
  font-size: 11px;
  line-height: 16px;
  font-variant-numeric: tabular-nums;
  pointer-events: none;
  z-index: 20;
}

.watabegg-footer span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.footer-text {
  text-align: center;
}

.footer-page {
  text-align: right;
}
</style>
