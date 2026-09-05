import { useEffect, useRef, useState } from 'react'
import { Box, Typography } from '@mui/material'
import { HieroglyphModel } from '../models/Hieroglyph.type'
import { HieroglyphDetailsPopper } from './HieroglyphDetailsPopper'
import { OutputGlyph } from './OutputGlyph'
import { OutputUtilities } from './OutputUtilities'

export interface HieroglyphOutputProps {
  glyphs: HieroglyphModel[]
  onClear: () => void
  value: string
}

const lineHeight = 1.5
const reservedLines = 3
const visibleLines = 4

export function HieroglyphOutput({ glyphs, onClear, value }: HieroglyphOutputProps) {
  const outputRef = useRef<HTMLDivElement>(null)
  const detailsTimer = useRef<number | null>(null)
  const [detailsAnchor, setDetailsAnchor] = useState<HTMLElement | null>(null)
  const [detailsHieroglyph, setDetailsHieroglyph] = useState<HieroglyphModel | null>(null)

  useEffect(() => {
    const output = outputRef.current
    if (output) {
      output.scrollTop = output.scrollHeight
    }
  }, [value])

  useEffect(() => () => {
    if (detailsTimer.current !== null) {
      window.clearTimeout(detailsTimer.current)
    }
  }, [])

  function hideDetails() {
    if (detailsTimer.current !== null) {
      window.clearTimeout(detailsTimer.current)
      detailsTimer.current = null
    }

    setDetailsAnchor(null)
    setDetailsHieroglyph(null)
  }

  function showDetails(hieroglyph: HieroglyphModel, anchorElement: HTMLElement) {
    if (detailsTimer.current !== null) {
      window.clearTimeout(detailsTimer.current)
    }

    detailsTimer.current = window.setTimeout(() => {
      setDetailsAnchor(anchorElement)
      setDetailsHieroglyph(hieroglyph)
      detailsTimer.current = null
    }, 350)
  }

  function toggleDetails(hieroglyph: HieroglyphModel, anchorElement: HTMLElement) {
    if (detailsAnchor === anchorElement) {
      hideDetails()
      return
    }

    if (detailsTimer.current !== null) {
      window.clearTimeout(detailsTimer.current)
      detailsTimer.current = null
    }

    setDetailsAnchor(anchorElement)
    setDetailsHieroglyph(hieroglyph)
  }

  return (
    <Box
      sx={{
        boxSizing: 'border-box',
        direction: 'ltr',
        fontSize: { xs: '2.25rem', sm: '3rem' },
        mb: 3,
        minHeight: `calc(${reservedLines * lineHeight}em + 16px)`,
        mt: { xs: 6, sm: 8 },
        position: 'relative',
        textAlign: 'left',
        width: '100%',
      }}
      onClick={hideDetails}
    >
      <Box
        ref={outputRef}
        role="status"
        aria-label="Hieroglyph output"
        sx={{
          backgroundColor: 'var(--background-color)',
          border: '1px solid var(--background-color)',
          boxSizing: 'border-box',
          maxHeight: `calc(${visibleLines * lineHeight}em + 16px)`,
          minHeight: `calc(${lineHeight}em + 16px)`,
          overflowWrap: 'anywhere',
          overflowX: 'hidden',
          overflowY: 'auto',
          p: 1,
          pr: 12,
          direction: 'ltr',
          textAlign: 'left',
          whiteSpace: 'pre-wrap',
          width: '100%',
        }}
      >
        <Typography
          component="div"
          sx={{
            fontSize: 'inherit',
            fontWeight: 'bold',
            letterSpacing: '0.08em',
            lineHeight,
            textAlign: 'left',
            width: '100%',
          }}
        >
          {glyphs.map((hieroglyph, index) => (
            <OutputGlyph
              key={`${hieroglyph.id}-${index}`}
              hieroglyph={hieroglyph}
              onHideDetails={hideDetails}
              onShowDetails={showDetails}
              onToggleDetails={toggleDetails}
            />
          ))}
        </Typography>
      </Box>
      <OutputUtilities value={value} onClear={onClear} />
      <HieroglyphDetailsPopper anchorElement={detailsAnchor} hieroglyph={detailsHieroglyph} />
    </Box>
  )
}
