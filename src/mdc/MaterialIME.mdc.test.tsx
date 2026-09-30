// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) Inpu contributors
// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { MaterialIME } from '../components/MaterialIME'
import { useDatabase } from '../hooks/useDatabase'
import { HieroglyphCategory } from '../models/Hieroglyph.type'

vi.mock('../hooks/useDatabase', () => ({ useDatabase: vi.fn() }))
// Candidate geometry is outside this mode/state test and requires real layout.
vi.mock('../components/CandidatesMenu', () => ({ CandidatesMenu: () => null }))
vi.mock('./hierojaxAdapter', () => ({
  loadHieroglyphicFont: vi.fn().mockResolvedValue(undefined),
  renderHieroglyphicUnicode: vi.fn(),
}))

const writeText = vi.fn().mockResolvedValue(undefined)
const originalClipboard = Object.getOwnPropertyDescriptor(navigator, 'clipboard')

beforeEach(() => {
  vi.mocked(useDatabase).mockReturnValue({
    lookupInputTransliterationCandidates: vi.fn().mockReturnValue([]),
    lookupInputGardinerCandidates: vi.fn().mockReturnValue([]),
    lookupInputDescriptionCandidates: vi.fn().mockReturnValue([]),
  } as unknown as ReturnType<typeof useDatabase>)
  Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } })
})
afterEach(() => {
  cleanup()
  writeText.mockClear()
  if (originalClipboard) Object.defineProperty(navigator, 'clipboard', originalClipboard)
  else Reflect.deleteProperty(navigator, 'clipboard')
})

async function enterMdc() {
  // Shift+Tab cycles from the first existing mode directly to MdC.
  fireEvent.keyDown(document, { key: 'Tab', shiftKey: true })
  return screen.findByRole('textbox', { name: 'Manuel de Codage input' })
}

describe('MdC mode integration', () => {
  it('preserves candidate-mode input/output and the MdC draft across switches', async () => {
    const glyph = {
      id: 1, glyph: '𓋹', name: 'ankh', category: HieroglyphCategory.TRILITERAL,
      transliteration: 'ꜥnḫ', input_transliteration: 'anx', gardiner_code: 'S34', gardiner_group: 'S',
    }
    vi.mocked(useDatabase).mockReturnValue({
      lookupInputTransliterationCandidates: vi.fn().mockReturnValue([glyph]),
      lookupInputGardinerCandidates: vi.fn().mockReturnValue([glyph]),
      lookupInputDescriptionCandidates: vi.fn().mockReturnValue([glyph]),
    } as unknown as ReturnType<typeof useDatabase>)
    render(<MaterialIME />)
    const original = screen.getByRole('textbox', { name: 'Phonogram input' })
    fireEvent.change(original, { target: { value: 'anx' } })
    fireEvent.keyDown(original, { key: 'Enter' })
    fireEvent.change(original, { target: { value: 'n' } })
    const mdc = await enterMdc()
    fireEvent.change(mdc, { target: { value: 'A1:O1' } })
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Copy hieroglyph output' })) })
    expect(writeText).toHaveBeenLastCalledWith('𓀀𓐰𓉐')
    fireEvent.keyDown(document, { key: 'Tab' })
    expect((screen.getByRole('textbox', { name: 'Phonogram input' }) as HTMLInputElement).value).toBe('n')
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Copy hieroglyph output' })) })
    expect(writeText).toHaveBeenLastCalledWith('𓋹')
    const restored = await enterMdc()
    expect((restored as HTMLTextAreaElement).value).toBe('A1:O1')
  })

  it('copies the last valid output on incomplete input, and Clear resets the draft', async () => {
    render(<MaterialIME />)
    const input = await enterMdc()
    fireEvent.change(input, { target: { value: 'W24*Z7' } })
    fireEvent.change(input, { target: { value: 'W24*' } })
    expect(screen.getByText(/Showing the last valid composition/)).toBeTruthy()
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Copy hieroglyph output' })) })
    expect(writeText).toHaveBeenCalledWith('𓏌𓐱𓏲')
    fireEvent.keyDown(document, { key: 'Delete', shiftKey: true })
    expect((input as HTMLTextAreaElement).value).toBe('')
    expect((screen.getByRole('button', { name: 'Copy hieroglyph output' }) as HTMLButtonElement).disabled).toBe(true)
    fireEvent.change(input, { target: { value: '<' } })
    fireEvent.keyDown(document, { key: 'Delete', shiftKey: true })
    expect((input as HTMLTextAreaElement).value).toBe('')
  })

  it('does not intercept selected MdC source when copying text', async () => {
    render(<MaterialIME />)
    const input = await enterMdc() as HTMLTextAreaElement
    fireEvent.change(input, { target: { value: 'A1:O1' } })
    input.setSelectionRange(0, 5)
    const nativeAllowed = fireEvent.keyDown(input, { key: 'c', ctrlKey: true })
    expect(nativeAllowed).toBe(true)
    expect(writeText).not.toHaveBeenCalled()
    input.setSelectionRange(5, 5)
    fireEvent.keyDown(input, { key: 'c', ctrlKey: true })
    await waitFor(() => expect(writeText).toHaveBeenCalledWith('𓀀𓐰𓉐'))
  })
})
