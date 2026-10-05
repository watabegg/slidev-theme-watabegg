export interface WatabeggThemeConfig {
  color?: unknown
  density?: unknown
  footer?: unknown
  navigation?: unknown
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

export function getWatabeggThemeConfig(
  slidevConfigs: Record<string, unknown> | undefined,
): WatabeggThemeConfig {
  const themeConfig = slidevConfigs?.themeConfig
  if (!isRecord(themeConfig)) return {}

  const watabegg = themeConfig.watabegg
  return isRecord(watabegg) ? watabegg : {}
}
