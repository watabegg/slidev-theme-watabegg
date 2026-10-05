interface ReferenceBase {
  number: number
  title: string
  url?: string
  accessed?: string
}

export type SlideReference =
  | (ReferenceBase & { type: 'web'; url: string; accessed: string; authors?: string[] })
  | (ReferenceBase & { type: 'book'; authors: string[]; year: number; publisher: string })
  | (ReferenceBase & { type: 'article'; authors: string[]; year: number; venue: string })

function requiredText(value: unknown, name: string) {
  if (typeof value !== 'string' || !value.trim()) throw new Error(`${name}を指定してください。`)
}

/** Validate Markdown-authored props too, then produce one consistent citation format. */
export function formatReferences(items: SlideReference[]) {
  if (!Array.isArray(items)) throw new Error('itemsには文献の配列を指定してください。')
  const numbers = new Set<number>()
  return items.map((item) => {
    if (!item || !Number.isInteger(item.number) || item.number < 1)
      throw new Error('numberには正の整数を指定してください。')
    if (numbers.has(item.number)) throw new Error(`[${item.number}]が重複しています。`)
    numbers.add(item.number)
    if (!['web', 'book', 'article'].includes(item.type))
      throw new Error('typeはweb / book / articleから指定してください。')
    requiredText(item.title, 'title')
    if (item.type !== 'web' || item.authors !== undefined) {
      if (!Array.isArray(item.authors) || !item.authors.length)
        throw new Error('authorsには著者名の配列を指定してください。')
      for (const author of item.authors) requiredText(author, 'authors')
    }
    if (item.type === 'web') {
      requiredText(item.url, 'url')
      requiredText(item.accessed, 'accessed')
    } else {
      if (!Number.isInteger(item.year) || item.year < 1)
        throw new Error('yearには出版年を指定してください。')
      requiredText(
        item.type === 'book' ? item.publisher : item.venue,
        item.type === 'book' ? 'publisher' : 'venue',
      )
    }
    if (item.accessed !== undefined) {
      const date = new Date(`${item.accessed}T00:00:00Z`)
      if (
        !/^\d{4}-\d{2}-\d{2}$/.test(item.accessed) ||
        !Number.isFinite(date.getTime()) ||
        date.toISOString().slice(0, 10) !== item.accessed
      ) {
        throw new Error('accessedには実在する日付をYYYY-MM-DD形式で指定してください。')
      }
    }
    if (item.url !== undefined) {
      try {
        if (!['https:', 'http:'].includes(new URL(item.url).protocol)) throw new Error()
      } catch {
        throw new Error('urlにはhttp / httpsのURLを指定してください。')
      }
    }
    const parts = [item.authors?.join(', '), item.title]
    if (item.type === 'book') parts.push(item.publisher, String(item.year))
    if (item.type === 'article') parts.push(item.venue, String(item.year))
    if (item.accessed) parts.push(`閲覧日: ${item.accessed}`)
    const fields = parts.filter((part): part is string => Boolean(part))
    const text = fields
      .map((part, index) => (index === fields.length - 1 || part.endsWith('.') ? part : `${part}.`))
      .join(' ')
    return { number: item.number, text, url: item.url }
  })
}
