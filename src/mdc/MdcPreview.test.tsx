// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) Inpu contributors
// @vitest-environment jsdom
import { StrictMode } from 'react'
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { MdcPreview } from './MdcPreview'
import { loadHieroglyphicFont, renderHieroglyphicUnicode } from './hierojaxAdapter'

vi.mock('./hierojaxAdapter', () => ({
  loadHieroglyphicFont: vi.fn(),
  renderHieroglyphicUnicode: vi.fn(),
}))

beforeEach(() => {
  vi.mocked(loadHieroglyphicFont).mockResolvedValue(undefined)
  vi.mocked(renderHieroglyphicUnicode).mockImplementation(host => {
    host.replaceChildren(document.createElementNS('http://www.w3.org/2000/svg', 'svg'))
  })
})
afterEach(() => { cleanup(); vi.resetAllMocks() })

describe('preview adapter boundary', () => {
  it('passes unchanged Unicode to the SVG adapter after font readiness', async () => {
    const unicode = '\u{13000}\u{13430}\u{13250}'
    render(<StrictMode><MdcPreview unicode={unicode} /></StrictMode>)
    await waitFor(() => expect(renderHieroglyphicUnicode).toHaveBeenCalledTimes(1))
    expect(vi.mocked(renderHieroglyphicUnicode).mock.calls[0][1]).toBe(unicode)
  })

  it.each([
    '\u{13000}\u{13430}\u{13250}',
    '\u{133CC}\u{13431}\u{133F2}',
    '\u{13000}\u{13431}\u{13437}\u{133CC}\u{13430}\u{133F2}\u{13438}',
  ])('copies the complete canonical fragment, including format controls', async unicode => {
    render(<MdcPreview unicode={unicode} />)
    await waitFor(() => expect(renderHieroglyphicUnicode).toHaveBeenCalled())
    const setData = vi.fn()
    const preview = screen.getByLabelText('MdC hieroglyph output')
    const nativeCopyAllowed = fireEvent.copy(preview, { clipboardData: { setData } })
    expect(nativeCopyAllowed).toBe(false)
    expect(setData).toHaveBeenCalledExactlyOnceWith('text/plain', unicode)
  })

  it('discards stale font callbacks on edits and unmount', async () => {
    let ready!: () => void
    vi.mocked(loadHieroglyphicFont).mockReturnValue(new Promise<void>(resolve => { ready = resolve }))
    const view = render(<MdcPreview unicode="𓀀" />)
    view.rerender(<MdcPreview unicode="𓀀𓐰𓉐" />)
    await act(async () => { ready() })
    expect(renderHieroglyphicUnicode).toHaveBeenCalledTimes(1)
    expect(vi.mocked(renderHieroglyphicUnicode).mock.calls[0][1]).toBe('𓀀𓐰𓉐')
    const host = vi.mocked(renderHieroglyphicUnicode).mock.calls[0][0]
    view.unmount()
    expect(host.childNodes.length).toBe(0)
  })

  it('reports font failures and still provides canonical clipboard data', async () => {
    vi.mocked(loadHieroglyphicFont).mockRejectedValue(new Error('font unavailable'))
    render(<MdcPreview unicode="𓀀𓐰𓉐" />)
    await screen.findByText(/Preview unavailable/)
    expect(renderHieroglyphicUnicode).not.toHaveBeenCalled()
    const setData = vi.fn()
    fireEvent.copy(screen.getByLabelText('MdC hieroglyph output'), { clipboardData: { setData } })
    expect(setData).toHaveBeenCalledWith('text/plain', '𓀀𓐰𓉐')
  })

  it('does not render after unmounting while a font is still loading', async () => {
    let ready!: () => void
    vi.mocked(loadHieroglyphicFont).mockReturnValue(new Promise<void>(resolve => { ready = resolve }))
    const view = render(<MdcPreview unicode="𓀀" />)
    view.unmount()
    await act(async () => { ready() })
    expect(renderHieroglyphicUnicode).not.toHaveBeenCalled()
  })
})
