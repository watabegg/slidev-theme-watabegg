<template>
  <div class="slidev-layout end">
    <div class="content">
      <h1>{{ $frontmatter.title || 'ご清聴ありがとうございました' }}</h1>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSlideContext } from '@slidev/client'
const { $frontmatter } = useSlideContext()

</script>

<style scoped>
.content {
  z-index: 10;
  position: relative;
}

.slidev-layout.end {
  display: grid;
  place-content: center;
  text-align: center;
}

.content h1 {
  border: none;
}

.default {
  margin-top: 2rem;
  color: white;
}

</style>
