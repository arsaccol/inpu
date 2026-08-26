import { useEffect, useRef } from 'react'
import { Box, Typography } from '@mui/material'
import { CopyButton } from './CopyButton'

export interface HieroglyphOutputProps {
  value: string
}

const lineHeight = 1.5
const reservedLines = 3
const visibleLines = 4

export function HieroglyphOutput({ value }: HieroglyphOutputProps) {
  const outputRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const output = outputRef.current
    if (output) {
      output.scrollTop = output.scrollHeight
    }
  }, [value])

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
          pr: 6,
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
          {value}
        </Typography>
      </Box>
      <CopyButton value={value} />
    </Box>
  )
}
