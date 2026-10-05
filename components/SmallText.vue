<script setup lang="ts">
defineProps<{ inline?: boolean }>()
</script>

<template>
  <component :is="inline ? 'span' : 'div'" class="small-text"><slot /></component>
</template>

<style scoped>
.small-text {
  font-size: var(--watabegg-small-text-size);
  line-height: 1.4;
}

.small-text :deep(p),
.small-text :deep(ul),
.small-text :deep(ol) {
  margin: calc(var(--watabegg-block-gap) * 0.6) 0;
}

.small-text :deep(p),
.small-text :deep(li) {
  line-height: inherit;
}
</style>
