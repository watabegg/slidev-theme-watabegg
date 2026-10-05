<script setup lang="ts">
defineProps<{ number: string }>()
</script>

<template>
  <span class="section-number">
    <span
      class="section-number-text"
      :style="{ fontSize: `calc(var(--section-number-size, 2em) / ${Math.max(2, number.length * 0.72)})` }"
    >{{ number }}</span>
  </span>
</template>

<style scoped>
.section-number {
  display: inline-grid;
  place-items: center;
  flex: none;
  width: var(--section-number-size, 2em);
  height: var(--section-number-size, 2em);
  border-radius: 50%;
  background: var(--slidev-theme-primary);
  color: white;
  font-family: var(--slidev-font-family);
  font-size: 0.8em;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  line-height: 1;
}

.section-number-text {
  white-space: nowrap;
}
</style>
