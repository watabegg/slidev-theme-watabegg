declare module '@slidev/client' {
  import type { ComputedRef, Ref } from 'vue'

  export interface SlidevNavState {
    currentLayout: string
    currentPage: number
    total: number
    slides: SlideRouteLike[]
  }

  export interface SlidevConfigsLike extends Record<string, unknown> {
    themeConfig?: Record<string, unknown>
  }

  export interface SlideRouteLike {
    no?: number
    meta?: {
      slide?: {
        title?: string
        level?: number
        frontmatter?: Record<string, unknown>
      }
    }
  }

  export interface SlidevContextLike {
    configs: SlidevConfigsLike
    nav: SlidevNavState
  }

  export interface SlideContextLike {
    $slidev: SlidevContextLike
    $nav: Ref<SlidevNavState>
    $clicksContext: {
      setup: () => void
    }
    $clicks: Ref<number>
    $page: Ref<number>
    $route?: unknown
    $renderContext: Ref<string>
    $frontmatter: Record<string, unknown>
    $scale: Ref<number>
    $zoom: ComputedRef<number>
  }

  export function useSlideContext(): SlideContextLike

  export function useNav(): {
    currentSlideRoute: Ref<SlideRouteLike>
    isPrintMode: Ref<boolean>
  }
}
