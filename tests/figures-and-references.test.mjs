import assert from 'node:assert/strict'
import { test } from 'node:test'
import { fitDiagram } from '../utils/figure.ts'
import { formatReferences } from '../utils/references.ts'

test('wide and tall diagrams fit their bounds without changing aspect ratio or enlarging', () => {
  assert.deepEqual(fitDiagram(1200, 300, 900, 260), { width: 900, height: 225 })
  assert.deepEqual(fitDiagram(700, 1000, 900, 260), { width: 182, height: 260 })
  assert.deepEqual(fitDiagram(100, 50, 900, 260), { width: 100, height: 50 })
  assert.deepEqual(fitDiagram(400, 200, 900, 260, 0.5), { width: 200, height: 100 })
  assert.deepEqual(fitDiagram(400, 200, 900, 0), { width: 0, height: 0 })
})

const web = {
  number: 1,
  type: 'web',
  title: 'Slidev',
  url: 'https://sli.dev/',
  accessed: '2026-10-05',
}
const book = {
  number: 2,
  type: 'book',
  title: 'Book',
  authors: ['A', 'B'],
  year: 2006,
  publisher: 'Publisher',
}
const article = {
  number: 3,
  type: 'article',
  title: 'Paper',
  authors: ['C'],
  year: 2017,
  venue: 'Conference',
}

test('web, book and article references share a stable format and retain explicit numbers', () => {
  assert.deepEqual(formatReferences([web, book, article]), [
    { number: 1, text: 'Slidev. 閲覧日: 2026-10-05', url: 'https://sli.dev/' },
    { number: 2, text: 'A, B. Book. Publisher. 2006', url: undefined },
    { number: 3, text: 'C. Paper. Conference. 2017', url: undefined },
  ])
  assert.equal(formatReferences([{ ...web, number: 9 }])[0].number, 9)
  assert.equal(
    formatReferences([{ ...article, authors: ['C et al.'] }])[0].text,
    'C et al. Paper. Conference. 2017',
  )
})

test('malformed Markdown props expose missing fields, duplicate labels and invalid dates', () => {
  for (const item of [
    { ...web, number: 0 },
    { ...web, type: 'other' },
    { ...web, title: '' },
    { ...web, url: undefined },
    { ...web, accessed: '2026-02-30' },
    { ...web, accessed: '10/05/2026' },
    { ...book, authors: [] },
    { ...book, publisher: undefined },
    { ...book, year: 2006.5 },
    { ...article, venue: undefined },
  ])
    assert.throws(() => formatReferences([item]))
  assert.throws(() => formatReferences([web, web]), /重複/)
  assert.throws(() => formatReferences(null), /配列/)
  assert.doesNotThrow(() => formatReferences([{ ...web, accessed: '2024-02-29' }]))
})

test('reference URLs allow external web links and reject executable or relative URLs', () => {
  for (const url of ['javascript:alert(1)', 'data:text/html,test', '/relative', 'https://']) {
    assert.throws(() => formatReferences([{ ...web, url }]), /URL/)
  }
  assert.doesNotThrow(() => formatReferences([{ ...web, url: 'http://example.com/paper' }]))
})
