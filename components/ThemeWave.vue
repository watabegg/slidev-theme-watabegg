<script setup lang="ts">
import { useId } from 'vue'

const gradientId = `wave-${useId()}`
</script>

<template>
  <div class="theme-wave" aria-hidden="true">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1280 700"
      width="100%"
      height="100%"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient
          :id="gradientId"
          gradientUnits="userSpaceOnUse"
          x1="0" y1="0" x2="700" y2="700"
          gradientTransform="scale(1.83, 1)"
        >
          <stop offset="0%" stop-color="var(--cover-gradient-start)" />
          <stop offset="100%" stop-color="var(--cover-gradient-end)" />
        </linearGradient>
      </defs>
      <path
        d="M -1049.6 400 Q -729.6 400 -409.6 550 Q 230.4 850 870.4 550 Q 1190.4 400 1510.4 400 Q 1830.4 400 2150.4 550 Q 2790.4 850 3430.4 550 Q 3750.4 400 4070.4 400 L 1280 0 L 0 0 Z"
        :fill="`url(#${gradientId})`"
      />
    </svg>
  </div>
</template>

<style scoped>
.theme-wave {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}
</style>
