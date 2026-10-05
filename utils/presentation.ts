import { getWatabeggThemeConfig } from './themeConfig'

export type PresentationDensity = 'research' | 'comfortable'

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' ? (value as Record<string, unknown>) : {}
}

function text(value: unknown): string {
  return typeof value === 'string' || typeof value === 'number' ? String(value) : ''
}

export function getPresentationSettings(
  frontmatter: Record<string, unknown>,
  configs: Record<string, unknown> | undefined,
) {
  const theme = getWatabeggThemeConfig(configs)
  const density: PresentationDensity = theme.density === 'comfortable' ? 'comfortable' : 'research'
  const deckFooter = record(theme.footer)
  const footer = { ...deckFooter, ...record(frontmatter.footer) }
  const layout = frontmatter.layout
  const footerEnabled =
    frontmatter.footer === true || (frontmatter.footer !== false && theme.footer !== false)

  return {
    density,
    footer: {
      visible: footerEnabled && !['cover', 'image', 'image-scroll'].includes(String(layout)),
      date: text(footer.date ?? frontmatter.date ?? configs?.date),
      text: text(deckFooter.text),
      pageNumber: footer.pageNumber !== false,
    },
  }
}

export function getDensityVariables(density: PresentationDensity) {
  const comfortable = density === 'comfortable'
  return {
    '--slidev-font-size-base': comfortable ? '24px' : '20px',
    '--slidev-line-height': comfortable ? '1.5' : '1.45',
    '--watabegg-slide-x': comfortable ? '32px' : '28px',
    '--watabegg-slide-y': comfortable ? '32px' : '24px',
    '--watabegg-title-size': comfortable ? '40px' : '30px',
    '--watabegg-h2-size': comfortable ? '32px' : '25px',
    '--watabegg-h3-size': comfortable ? '24px' : '22px',
    '--watabegg-block-gap': comfortable ? '16px' : '10px',
    '--watabegg-list-gap': comfortable ? '8px' : '4px',
    '--watabegg-column-gap': comfortable ? '32px' : '28px',
    '--watabegg-card-padding': comfortable ? '24px' : '16px',
    '--watabegg-cover-title': comfortable ? '72px' : '48px',
    '--watabegg-cover-subtitle': comfortable ? '30px' : '24px',
    '--watabegg-agenda-size': comfortable ? '36px' : '30px',
    '--watabegg-agenda-badge-size': comfortable ? '48px' : '44px',
    '--watabegg-section-size': comfortable ? '48px' : '40px',
    '--watabegg-small-text-size': comfortable ? '18px' : '16px',
  }
}
