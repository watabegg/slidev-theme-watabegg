import assert from 'node:assert/strict'
import { test } from 'node:test'
import { getActiveSectionNumber, getAgendaOutline, getSectionItem } from '../utils/agenda.ts'

const slide = (no, title, frontmatter = {}) => ({
  no,
  meta: { slide: { title, frontmatter } },
})
const section = (no, title, level = 1) => slide(no, title, { layout: 'section', level })

test('automatic outline numbers sections in slide order, skipping content slides', () => {
  const slides = [
    slide(1, 'Cover', { layout: 'cover' }),
    slide(2, 'Agenda', { layout: 'agenda' }),
    section(3, '目的と背景'),
    section(4, '目的', 2),
    slide(5, '本文'),
    section(6, '背景', 2),
    section(7, '手法'),
    section(8, '実験', 2),
    section(9, '条件', 3),
    section(10, '結果'),
  ]
  const outline = getAgendaOutline(slides)
  assert.deepEqual(
    outline.map(({ title, number }) => [title, number]),
    [
      ['目的と背景', '1'],
      ['目的', '2'],
      ['背景', '3'],
      ['手法', '4'],
      ['実験', '5'],
      ['条件', '6'],
      ['結果', '7'],
    ],
  )
  assert.equal(getSectionItem(outline, {}, '条件', 9)?.number, '6')
  assert.equal(getActiveSectionNumber(outline, slides, 2), undefined)
  assert.equal(getActiveSectionNumber(outline, slides, 5), '2')
  assert.equal(getActiveSectionNumber(outline, slides, 10), '6')
})

test('the first manual agenda is shared and sections match by title or number', () => {
  const slides = [
    slide(1, 'Agenda', {
      layout: 'agenda',
      agenda: [{ title: '目的と背景' }, null, { detail: 'ignored' }, '', '手法'],
    }),
    section(2, '目的と背景'),
    section(3, '目的', 2),
    slide(4, 'Agenda', { layout: 'agenda' }),
    section(5, '背景', 2),
  ]
  const outline = getAgendaOutline(slides)
  assert.deepEqual(
    outline.map((item) => item.number),
    ['1', '2'],
  )
  assert.equal(getSectionItem(outline, {}, '目的と背景')?.number, '1')
  assert.equal(getSectionItem(outline, { sectionNumber: 2, title: '実験方法' })?.title, '手法')
  assert.equal(getActiveSectionNumber(outline, slides, 4), undefined)
  assert.equal(getSectionItem(outline, { sectionNumber: '9' }), undefined)
})

test('repeated automatic section titles are resolved by slide number', () => {
  const outline = getAgendaOutline([section(2, 'まとめ'), section(4, 'まとめ')])
  assert.equal(getSectionItem(outline, {}, 'まとめ', 2)?.number, '1')
  assert.equal(getSectionItem(outline, {}, 'まとめ', 4)?.number, '2')
  assert.equal(getSectionItem(outline, {}, 'まとめ'), undefined)
})

test('reordering sections updates the shared agenda and section badge numbers', () => {
  const before = getAgendaOutline([section(2, '目的'), section(3, '手法')])
  const after = getAgendaOutline([section(2, '手法'), section(3, '目的')])
  assert.equal(getSectionItem(before, {}, '手法', 3)?.number, '2')
  assert.equal(getSectionItem(after, {}, '手法', 2)?.number, '1')
  assert.deepEqual(
    after.map((item) => item.title),
    ['手法', '目的'],
  )
})

test('an empty deck or explicit empty agenda has no numbered items', () => {
  assert.deepEqual(getAgendaOutline([]), [])
  assert.deepEqual(
    getAgendaOutline([slide(1, 'Agenda', { layout: 'agenda', agenda: [] }), section(2, '目的')]),
    [],
  )
})
