// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) Inpu contributors
import { describe, expect, it } from 'vitest'
import { convertMdcToUnicode } from './convertMdcToUnicode'
import { updateMdcDraft } from './mdcState'
import type { MdcDraft } from './mdcState'

describe('MdC conversion without a browser or font', () => {
  it.each([
    ['A1:O1', '\u{13000}\u{13430}\u{13250}'],
    ['W24*Z7', '\u{133CC}\u{13431}\u{133F2}'],
    ['A1*(W24:Z7)', '\u{13000}\u{13431}\u{13437}\u{133CC}\u{13430}\u{133F2}\u{13438}'],
    ['anx', '\u{132F9}'],
    ['n', '\u{13216}'],
    ['A1\\h', '\u{13000}\u{13440}'],
    ['A1#O1', '\u{13000}\u{13436}\u{13250}'],
    ['<-A1->', '\u{13379}\u{1343C}\u{13000}\u{1343D}\u{1337A}'],
    ['..', '\u{13441}'],
    ['//', '\u{13443}'],
    ['A1\nW24*Z7', '\u{13000}\n\u{133CC}\u{13431}\u{133F2}'],
  ])('converts %s to its exact Unicode sequence', (source, unicode) => {
    expect(convertMdcToUnicode(source).unicode).toBe(unicode)
  })

  it('preserves the upstream mapping of a known ligature', () => {
    expect(convertMdcToUnicode('G1&M17&M17').unicode)
      .toBe('\u{1313F}\u{13434}\u{13437}\u{131CB}\u{13431}\u{131CB}\u{13438}')
  })

  it.each(['A1:', '(A1*B1', '<', 'A999', 'A1*', '+lLatin text'])('rejects %s safely', source => {
    expect(() => convertMdcToUnicode(source)).toThrow()
  })

  it('does not warn for ordinary quadrats', () => {
    expect(convertMdcToUnicode('A1:O1').warnings).toEqual([])
  })

  it('explains discarded scaling and color without blocking the sign', () => {
    const result = convertMdcToUnicode('A1\\50\\red')
    expect(result.unicode).toBe('\u{13000}')
    expect(result.warnings.join(' ')).toMatch(/scaling.*omitted.*Color/s)
  })

  it('warns about ignored modifiers, approximate signs and ligature placement', () => {
    expect(convertMdcToUnicode('A1\\foo').warnings.join(' ')).toMatch(/unsupported modifier/)
    expect(convertMdcToUnicode('A133').warnings.join(' ')).toMatch(/approximate/)
    expect(convertMdcToUnicode('G1&M17&M17').warnings.join(' ')).toMatch(/heuristics/)
  })

  it('allows clearing whitespace-only input', () => {
    expect(convertMdcToUnicode(' \n ')).toEqual({ unicode: '', warnings: [] })
  })
})

describe('MdC draft transitions', () => {
  const empty: MdcDraft = { source: '', unicode: '', warnings: [], status: 'empty' }

  it('keeps source and last valid Unicode through an error and recovers immediately', () => {
    const valid = updateMdcDraft(empty, 'A1:O1')
    const invalid = updateMdcDraft(valid, '(A1*')
    expect(invalid.status).toBe('invalid')
    expect(invalid.source).toBe('(A1*')
    expect(invalid.unicode).toBe(valid.unicode)
    const recovered = updateMdcDraft(invalid, 'W24*Z7')
    expect(recovered.status).toBe('valid')
    expect(recovered.unicode).toBe('\u{133CC}\u{13431}\u{133F2}')
    expect(recovered.error).toBeUndefined()
    expect(updateMdcDraft(recovered, '')).toEqual(empty)
  })
})
