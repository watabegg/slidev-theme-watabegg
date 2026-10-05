<template>
  <div 
    class="textbox"
    :class="computedClasses"
    :style="computedStyles"
    v-click="vClick"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  x?: number
  y?: number
  width?: number
  height?: number
  color?: string
  textBg?: string
  vClick?: number
}

const props = withDefaults(defineProps<Props>(), {
  x: 0,
  y: 0,
  width: 300,
  height: undefined,
  color: undefined,
  textBg: undefined,
  vClick: undefined
})

const computedStyles = computed(() => ({
  left: `${props.x}px`,
  top: `${props.y}px`,
  width: `${props.width}px`,
  ...(props.height && { height: `${props.height}px` })
}))

const computedClasses = computed(() => {
  const classes: string[] = []

  if (props.textBg) {
    classes.push(`bg-${props.textBg}`)
  }
  
  if (props.color) {
    classes.push(`text-${props.color}`)
  }
  
  return classes
})
</script>

<style scoped>
  .textbox {
    position: absolute;
    background-color: rgba(255, 255, 255, 0);
    padding: calc(var(--watabegg-block-gap) * 0.6);
    border-radius: 0.5rem;
  }
  
  .bg-green {
    background: rgba(76, 175, 80);
    color: white;
  }

  .bg-blue {
    background: rgba(33, 150, 243);
    color: white;
  }

  .bg-red {
    background: rgba(244, 67, 54);
    color: white;
  }

  .bg-yellow {
    background: rgba(255, 193, 7);
    color: #333;
  }

  .bg-white {
    background: rgba(255, 255, 255);
  }

/* Text color variants */
.text-blue {
  color: #3b82f6;
}

.text-green {
  color: #10b981;
}

.text-red {
  color: #ef4444;
}

.text-purple {
  color: #8b5cf6;
}

.text-orange {
  color: #f97316;
}
</style>
