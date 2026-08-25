import { useEffect, useRef } from 'react'
import { Box, IconButton, SvgIcon, Typography } from '@mui/material'

export interface HieroglyphOutputProps {
  value: string
}

const lineHeight = 1.2
const visibleLines = 4

function CopyIcon() {
  return (
    <SvgIcon>
      <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1Zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2Zm0 16H8V7h11v14Z" />
    </SvgIcon>
  )
}

export function HieroglyphOutput({ value }: HieroglyphOutputProps) {
  const outputRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const output = outputRef.current
    if (output) {
      output.scrollTop = output.scrollHeight
    }
  }, [value])

  async function copyOutput() {
    try {
      await navigator.clipboard.writeText(value)
    } catch (error) {
      console.error('Could not copy hieroglyph output', error)
    }
  }

  return (
    <Box
      sx={{
        boxSizing: 'border-box',
        direction: 'ltr',
        fontSize: { xs: '2.25rem', sm: '3rem' },
        height: `calc(${visibleLines * lineHeight}em + 16px)`,
        mb: 2,
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
            lineHeight,
            textAlign: 'left',
            width: '100%',
          }}
        >
          {value}
        </Typography>
      </Box>
      <IconButton
        aria-label="Copy hieroglyph output"
        disabled={!value}
        onClick={copyOutput}
        title="Copy output"
        size="small"
        sx={{
          color: 'var(--text-color)',
          position: 'absolute',
          right: 8,
          top: 8,
        }}
      >
        <CopyIcon />
      </IconButton>
    </Box>
  )
}
