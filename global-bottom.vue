<script setup lang="ts">
import { computed } from 'vue'
import { useNav, useSlideContext } from '@slidev/client'

import ThemeFooter from './components/ThemeFooter.vue'
import { getDensityVariables, getPresentationSettings } from './utils/presentation'

const { $slidev } = useSlideContext()
const { currentSlideRoute, isPrintMode } = useNav()
const settings = computed(() => getPresentationSettings({
  ...currentSlideRoute.value.meta?.slide?.frontmatter,
  layout: $slidev.nav.currentLayout,
}, $slidev.configs))
const style = computed(() => ({
  ...getDensityVariables(settings.value.density),
  'view-transition-name': isPrintMode.value ? undefined : 'watabegg-footer',
}))
</script>

<template>
  <ThemeFooter
    v-show="settings.footer.visible"
    :date="settings.footer.date"
    :text="settings.footer.text"
    :page="$slidev.nav.currentPage"
    :total="$slidev.nav.total"
    :page-number="settings.footer.pageNumber"
    :style="style"
  />
</template>
