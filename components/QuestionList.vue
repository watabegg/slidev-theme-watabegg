<template>
  <div class="question-list" :style="{ '--level': currentLevel }">
    <div v-for="(item, index) in items" :key="index" class="question-item">
      <div class="item-content">
        <span class="item-label">{{ getLabel(index) }}</span>
        <span v-if="hasRenderableContent(item)" class="item-text">
          <KaTexReveal
            v-if="isKatexItem(item)"
            :formula="getFormula(item)"
            :block="isBlockFormula(item)"
            v-bind="getKatexAttrs(item)"
          />
          <span v-else v-html="renderItemText(item)" />
        </span>
      </div>
      <div v-if="hasSubItems(item)" class="sub-list" :style="{ marginTop: getItemText(item) ? 'var(--watabegg-block-gap)' : '0' }">
        <QuestionList
          :items="getSubItems(item)"
          :styles="styles"
          :level="currentLevel + 1"
          :start="Array.isArray(start) ? start : []"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import KaTexReveal from './KaTexReveal.vue'
import { renderInlineMarkdown } from '../utils/render'

type QuestionListItem = string | QuestionListItemObject

interface QuestionListItemObject {
  attrs?: Record<string, unknown>
  block?: boolean
  formula?: string
  items?: QuestionListItem[]
  label?: string
  text?: string
  tex?: boolean
  type?: string
  [key: string]: unknown
}

type CounterType =
  | 'decimal'
  | 'hiragana'
  | 'katakana'
  | 'kanji'
  | 'upperalpha'
  | 'loweralpha'
  | 'none'

type DecoratorType =
  | 'circle'
  | 'square'
  | 'paren'
  | 'dot'
  | 'q'
  | 'big-q'
  | 'none'

const props = withDefaults(defineProps<{
  items: QuestionListItem[]
  styles?: string[]
  level?: number
  start?: (number | string)[]
}>(), {
  styles: () => ['decimal-circle', 'katakana-paren', 'loweralpha-paren', 'decimal-dot'],
  level: 0,
  start: () => [],
})

const currentLevel = computed(() => props.level ?? 0)

const counterAliases: Record<string, CounterType> = {
  decimal: 'decimal',
  hiragana: 'hiragana',
  katakana: 'katakana',
  kanji: 'kanji',
  loweralpha: 'loweralpha',
  'lower-alpha': 'loweralpha',
  none: 'none',
  upperalpha: 'upperalpha',
  'upper-alpha': 'upperalpha',
}

const supportedCounters = Object.keys(counterAliases)
  .sort((left, right) => right.length - left.length)

const supportedDecorators: DecoratorType[] = ['big-q', 'circle', 'square', 'paren', 'dot', 'q', 'none']

const circledNumbers = [
  '①',
  '②',
  '③',
  '④',
  '⑤',
  '⑥',
  '⑦',
  '⑧',
  '⑨',
  '⑩',
  '⑪',
  '⑫',
  '⑬',
  '⑭',
  '⑮',
  '⑯',
  '⑰',
  '⑱',
  '⑲',
  '⑳',
]

const TEX_WRAPPERS = [
  { start: '$$', end: '$$' },
  { start: '\\[', end: '\\]' },
  { start: '\\(', end: '\\)' },
]

function isObjectItem(item: QuestionListItem): item is QuestionListItemObject {
  return typeof item === 'object' && item !== null
}

const stripTexDelimiters = (value: string): string => {
  const trimmed = value.trim()
  for (const { start, end } of TEX_WRAPPERS) {
    if (trimmed.startsWith(start) && trimmed.endsWith(end)) {
      return trimmed.slice(start.length, trimmed.length - end.length).trim()
    }
  }
  return trimmed
}

const extractFormulaFromText = (value?: string): string => {
  if (!value) return ''
  const trimmed = value.trim()
  for (const { start, end } of TEX_WRAPPERS) {
    if (trimmed.startsWith(start) && trimmed.endsWith(end)) {
      return stripTexDelimiters(trimmed)
    }
  }
  return ''
}

function parseStyle(style: string | undefined): { counterType: CounterType, decoratorType: DecoratorType } {
  const normalized = style?.trim().toLowerCase() ?? ''
  if (!normalized)
    return { counterType: 'decimal', decoratorType: 'dot' }

  if (normalized === 'none')
    return { counterType: 'none', decoratorType: 'none' }

  const counterKey = supportedCounters.find((candidate) => normalized === candidate || normalized.startsWith(`${candidate}-`))
  const counterType = counterKey
    ? counterAliases[counterKey]
    : 'decimal'

  const rawDecorator = counterKey && normalized.length > counterKey.length
    ? normalized.slice(counterKey.length + 1)
    : 'dot'

  const decoratorType = supportedDecorators.includes(rawDecorator as DecoratorType)
    ? rawDecorator as DecoratorType
    : 'dot'

  return { counterType, decoratorType }
}

function getTextContent(item: QuestionListItemObject | string | undefined) {
  if (typeof item === 'string')
    return item

  return typeof item?.text === 'string'
    ? item.text
    : ''
}

function getStartIndex(counterType: CounterType, value: number | string | undefined) {
  if (typeof value === 'number')
    return value - 1

  if (typeof value === 'string' && value.length > 0) {
    const firstChar = value[0]
    if (counterType === 'upperalpha')
      return firstChar.toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0)

    if (counterType === 'loweralpha')
      return firstChar.toLowerCase().charCodeAt(0) - 'a'.charCodeAt(0)
  }

  return 0
}

const hasRenderableContent = (item: QuestionListItem): boolean => {
  if (isKatexItem(item)) return true
  return Boolean(getItemText(item).trim())
}

const normalizedItemType = (item: QuestionListItemObject): string => {
  if (typeof item.type !== 'string') return ''
  return item.type.toLowerCase()
}

const getFormula = (item: QuestionListItem): string => {
  if (isObjectItem(item)) {
    if (typeof item.formula === 'string' && item.formula.trim()) {
      return stripTexDelimiters(item.formula)
    }
    const hint = item.tex === true || ['katex', 'tex', 'math'].includes(normalizedItemType(item))
    if (hint && typeof item.text === 'string') {
      return stripTexDelimiters(item.text)
    }
    return extractFormulaFromText(item.text)
  }
  return extractFormulaFromText(item) || ''
}

const isKatexItem = (item: QuestionListItem): boolean => Boolean(getFormula(item))

const isBlockFormula = (item: QuestionListItem): boolean => {
  if (isObjectItem(item) && typeof item.block === 'boolean') {
    return item.block
  }

  const source = isObjectItem(item)
    ? typeof item.formula === 'string'
      ? item.formula
      : typeof item.text === 'string'
        ? item.text
        : ''
    : item
  const trimmed = source.trim()
  if (!trimmed) return true
  if (trimmed.startsWith('\\(') && trimmed.endsWith('\\)')) return false
  if (trimmed.startsWith('$') && trimmed.endsWith('$') && !trimmed.startsWith('$$')) return false
  if (trimmed.startsWith('$$') && trimmed.endsWith('$$')) return true
  if (trimmed.startsWith('\\[') && trimmed.endsWith('\\]')) return true
  return true
}

const reservedItemKeys = new Set(['text', 'items', 'label', 'block', 'type', 'tex', 'formula', 'attrs'])

const getKatexAttrs = (item: QuestionListItem): Record<string, unknown> => {
  if (!isObjectItem(item)) {
    return {}
  }
  if (item.attrs && typeof item.attrs === 'object') {
    return item.attrs
  }
  const attrs: Record<string, unknown> = {}
  Object.keys(item).forEach((key) => {
    if (!reservedItemKeys.has(key)) {
      attrs[key] = item[key]
    }
  })
  return attrs
}

const getItemText = (item: QuestionListItem): string => getTextContent(item)

const hasSubItems = (item: QuestionListItem): boolean => isObjectItem(item) && Array.isArray(item.items)

const getSubItems = (item: QuestionListItem): QuestionListItem[] =>
  isObjectItem(item) && Array.isArray(item.items)
    ? item.items
    : []

const getLabel = (index: number): string => {
  const item = props.items[index]
  if (isObjectItem(item) && typeof item.label === 'string') {
    return item.label
  }

  const { counterType, decoratorType } = parseStyle(props.styles[currentLevel.value])
  if (counterType === 'none' || decoratorType === 'none')
    return ''

  const startIndex = getStartIndex(counterType, props.start[currentLevel.value])
  const currentIndex = startIndex + index

  let counter = ''
  switch (counterType) {
    case 'hiragana':
      counter = toHiragana(currentIndex)
      break
    case 'katakana':
      counter = toKatakana(currentIndex)
      break
    case 'kanji':
      counter = toKanji(currentIndex + 1)
      break
    case 'upperalpha':
      counter = String.fromCharCode('A'.charCodeAt(0) + currentIndex)
      break
    case 'loweralpha':
      counter = String.fromCharCode('a'.charCodeAt(0) + currentIndex)
      break
    case 'decimal':
      counter = (currentIndex + 1).toString()
      break
    default:
      counter = (currentIndex + 1).toString()
  }

  switch (decoratorType) {
    case 'circle':
      return circledNumbers[currentIndex] ?? `${counter}.`
    case 'square':
      return `[${counter}]`
    case 'paren':
      return `(${counter})`
    case 'dot':
      return `${counter}.`
    case 'q':
      return `問${counter}`
    case 'big-q':
      return `大問${counter}`
    default:
      return counter
  }
}

const renderItemText = (item: QuestionListItem) => renderInlineMarkdown(getItemText(item))

const toKatakana = (n: number) => {
  const katakana = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン'
  return katakana[((n % katakana.length) + katakana.length) % katakana.length]
}

const toHiragana = (n: number) => {
  const hiragana = 'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん'
  return hiragana[((n % hiragana.length) + hiragana.length) % hiragana.length]
}

const toKanji = (n: number) => {
  const kanji = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十']
  if (n <= 0) return n.toString()
  if (n <= 10) return kanji[n - 1]
  if (n < 20) return `十${kanji[n - 11]}`
  return n.toString()
}

</script>

<style scoped>
.question-list {
  padding-left: 0;
}
.question-item {
  margin-bottom: var(--watabegg-list-gap);
}
.item-content {
  display: flex;
  align-items: baseline;
  line-height: var(--slidev-line-height);
}
.item-label {
  font-weight: bold;
  color: var(--slidev-theme-primary);
  margin-right: 0.75em;
  min-width: 2em;
  text-align: right;
}
.item-text {
  flex: 1;
}
.item-text :deep(p) {
  margin: 0;
}
.item-text :deep(.katex-display),
.item-text :deep(.katex-display > .katex) {
  text-align: inherit;
}
.sub-list {
  margin-top: var(--watabegg-block-gap);
  padding-left: 2em;
}
</style>
