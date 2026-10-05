export interface OutlineSlide {
  no?: number
  meta?: {
    slide?: {
      title?: string
      level?: number
      frontmatter?: Record<string, unknown>
    }
  }
}

export interface AgendaItem {
  title: string
  number: string
  slideNo?: number
}

function readAgenda(value: unknown): AgendaItem[] {
  if (!Array.isArray(value)) return []
  const items: AgendaItem[] = []
  for (const valueItem of value) {
    const item =
      typeof valueItem === 'string'
        ? { title: valueItem }
        : valueItem && typeof valueItem === 'object'
          ? (valueItem as Record<string, unknown>)
          : undefined
    if (!item || typeof item.title !== 'string' || !item.title.trim()) continue
    items.push({
      title: item.title,
      number: String(items.length + 1),
    })
  }
  return items
}

// Like Slidev's Toc and academic themes, derive the outline from slide metadata.
// Keep it independent of the current viewer route for overview and export.
export function getAgendaOutline(slides: OutlineSlide[]): AgendaItem[] {
  const manualAgenda = slides.find((slide) => {
    const frontmatter = slide.meta?.slide?.frontmatter
    return frontmatter?.layout === 'agenda' && Array.isArray(frontmatter.agenda)
  })?.meta?.slide?.frontmatter?.agenda
  if (manualAgenda) return readAgenda(manualAgenda)

  const items: AgendaItem[] = []
  for (const slide of slides) {
    const metadata = slide.meta?.slide
    if (metadata?.frontmatter?.layout !== 'section') continue
    const title = metadata.frontmatter.title || metadata.title
    if (typeof title !== 'string' || !title.trim()) continue
    items.push({
      title,
      number: String(items.length + 1),
      slideNo: slide.no,
    })
  }
  return items
}

export function getSectionItem(
  items: AgendaItem[],
  frontmatter: Record<string, unknown>,
  title?: string,
  slideNo?: number,
): AgendaItem | undefined {
  const number = frontmatter.sectionNumber
  if (typeof number === 'string' || typeof number === 'number') {
    return items.find((item) => item.number === String(number))
  }
  const slideItem = items.find((item) => item.slideNo !== undefined && item.slideNo === slideNo)
  if (slideItem) return slideItem
  const matches = items.filter((item) => item.title === (frontmatter.title || title))
  return matches.length === 1 ? matches[0] : undefined
}

export function getActiveSectionNumber(
  items: AgendaItem[],
  slides: OutlineSlide[],
  page: number,
): string | undefined {
  const section = [...slides]
    .reverse()
    .find((slide) => (slide.no ?? 0) < page && slide.meta?.slide?.frontmatter?.layout === 'section')
  const metadata = section?.meta?.slide
  return metadata
    ? getSectionItem(items, metadata.frontmatter ?? {}, metadata.title, section?.no)?.number
    : undefined
}
