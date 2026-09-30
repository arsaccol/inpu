// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) Inpu contributors
import { useEffect, useRef, useState } from 'react'
import { Box, Typography } from '@mui/material'
import { loadHieroglyphicFont, renderHieroglyphicUnicode } from './hierojaxAdapter'

interface MdcPreviewProps {
  unicode: string
}

export function MdcPreview({ unicode }: MdcPreviewProps) {
  const hostRef = useRef<HTMLDivElement>(null)
  const [renderState, setRenderState] = useState<'ready' | 'loading' | 'error'>('ready')

  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    let cancelled = false
    host.replaceChildren()
    if (!unicode) {
      setRenderState('ready')
      return
    }
    setRenderState('loading')
    loadHieroglyphicFont().then(() => {
      if (cancelled) return
      renderHieroglyphicUnicode(host, unicode)
      setRenderState('ready')
    }).catch(() => {
      if (cancelled) return
      host.replaceChildren()
      setRenderState('error')
    })
    return () => {
      cancelled = true
      host.replaceChildren()
    }
  }, [unicode])

  return (
    <Box
      aria-label="MdC hieroglyph output"
      aria-busy={renderState === 'loading'}
      tabIndex={unicode ? 0 : -1}
      onCopy={event => {
        if (!unicode) return
        event.clipboardData.setData('text/plain', unicode)
        event.preventDefault()
      }}
      sx={{
        fontSize: { xs: '2.25rem', sm: '3rem' },
        minHeight: 'calc(1.5em + 16px)',
        maxHeight: 'calc(6em + 16px)',
        overflow: 'auto',
        p: 1,
        pr: 12,
        direction: 'ltr',
        '&:focus-visible': { outline: '2px solid currentColor' },
        '& svg': { verticalAlign: 'middle' },
      }}
    >
      {/* React never reconciles the renderer-owned children of this node. */}
      <div ref={hostRef} />
      {renderState !== 'ready' && (
        <Typography role="status" variant="body2" color={renderState === 'error' ? 'error' : 'text.secondary'}>
          {renderState === 'loading'
            ? 'Loading hieroglyph preview…'
            : 'Preview unavailable. Your Unicode output is still available to copy.'}
        </Typography>
      )}
    </Box>
  )
}
