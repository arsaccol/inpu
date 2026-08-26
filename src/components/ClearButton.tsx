import { useEffect, useId, useRef, useState } from 'react'
import { Box, IconButton, SvgIcon, SvgIconProps } from '@mui/material'
import { OutputFeedback } from './OutputFeedback'

export interface ClearButtonProps {
  disabled: boolean
  onClear: () => void
}

const feedbackDuration = 500

function DeleteIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12ZM8 9h8v10H8V9Zm7.5-5-1-1h-5l-1 1H5v2h14V4h-3.5Z" />
    </SvgIcon>
  )
}

export function ClearButton({ disabled, onClear }: ClearButtonProps) {
  const [cleared, setCleared] = useState(false)
  const feedbackId = useId()
  const feedbackTimer = useRef<number | null>(null)

  useEffect(() => () => {
    if (feedbackTimer.current !== null) {
      window.clearTimeout(feedbackTimer.current)
    }
  }, [])

  function clearOutput() {
    onClear()
    setCleared(true)

    if (feedbackTimer.current !== null) {
      window.clearTimeout(feedbackTimer.current)
    }

    feedbackTimer.current = window.setTimeout(() => {
      setCleared(false)
      feedbackTimer.current = null
    }, feedbackDuration)
  }

  return (
    <Box sx={{ display: 'flex', height: 34, position: 'relative' }}>
      <IconButton
        aria-describedby={cleared ? feedbackId : undefined}
        aria-label="Clear hieroglyph output"
        disabled={disabled}
        disableRipple
        onClick={clearOutput}
        size="small"
        title="Clear output"
        sx={(theme) => ({
          backgroundColor: cleared ? 'action.selected' : 'transparent',
          color: 'text.primary',
          height: 34,
          transition: theme.transitions.create(['background-color', 'color', 'transform'], {
            duration: theme.transitions.duration.shorter,
          }),
          '&:active': {
            transform: 'scale(0.92)',
          },
          '&:hover': {
            backgroundColor: cleared ? 'action.selected' : 'action.hover',
            color: cleared ? 'text.primary' : 'error.light',
          },
          '&.Mui-disabled': {
            backgroundColor: cleared ? 'action.selected' : 'transparent',
            color: cleared ? 'text.secondary' : 'action.disabled',
          },
          '&.Mui-focusVisible': {
            outline: '2px solid currentColor',
            outlineOffset: 2,
          },
          width: 34,
          '@media (prefers-reduced-motion: reduce)': {
            transition: 'none',
          },
        })}
      >
        <Box
          sx={(theme) => ({
            opacity: cleared ? 0.65 : 1,
            transition: theme.transitions.create('opacity', {
              duration: theme.transitions.duration.shorter,
            }),
            '@media (prefers-reduced-motion: reduce)': {
              transition: 'none',
            },
          })}
        >
          <DeleteIcon sx={{ fontSize: 28 }} />
        </Box>
      </IconButton>
      <OutputFeedback id={feedbackId} message="Output cleared" visible={cleared} />
    </Box>
  )
}
