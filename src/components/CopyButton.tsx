import { Ref, useEffect, useId, useRef, useState } from 'react'
import { Box, IconButton, SvgIcon } from '@mui/material'
import { OutputFeedback } from './OutputFeedback'

export interface CopyButtonProps {
  buttonRef?: Ref<HTMLButtonElement>
  value: string
}

const feedbackDuration = 2000

function CopyIcon() {
  return (
    <SvgIcon>
      <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1Zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2Zm0 16H8V7h11v14Z" />
    </SvgIcon>
  )
}

function CheckIcon() {
  return (
    <SvgIcon>
      <path d="m9 16.17-4.17-4.17-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17Z" />
    </SvgIcon>
  )
}

export function CopyButton({ buttonRef, value }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)
  const feedbackId = useId()
  const feedbackTimer = useRef<number | null>(null)

  useEffect(() => () => {
    if (feedbackTimer.current !== null) {
      window.clearTimeout(feedbackTimer.current)
    }
  }, [])

  async function copyOutput() {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)

      if (feedbackTimer.current !== null) {
        window.clearTimeout(feedbackTimer.current)
      }

      feedbackTimer.current = window.setTimeout(() => {
        setCopied(false)
        feedbackTimer.current = null
      }, feedbackDuration)
    } catch (error) {
      console.error('Could not copy hieroglyph output', error)
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        height: 34,
        position: 'relative',
      }}
    >
      <IconButton
        ref={buttonRef}
        aria-describedby={copied ? feedbackId : undefined}
        aria-label="Copy hieroglyph output"
        disabled={!value}
        disableRipple
        onClick={copyOutput}
        title="Copy output (Ctrl+C)"
        size="small"
        sx={(theme) => ({
          backgroundColor: copied ? 'success.main' : 'transparent',
          color: copied ? 'success.contrastText' : 'text.primary',
          height: 34,
          transition: theme.transitions.create(
            ['background-color', 'color', 'transform'],
            { duration: theme.transitions.duration.shorter },
          ),
          '&:active': {
            transform: 'scale(0.92)',
          },
          '&.Mui-focusVisible': {
            outline: '2px solid currentColor',
            outlineOffset: 2,
          },
          '&:hover': {
            backgroundColor: copied ? 'success.dark' : 'action.hover',
          },
          width: 34,
          '@media (prefers-reduced-motion: reduce)': {
            transition: 'none',
          },
        })}
      >
        <Box
          sx={{
            height: 24,
            position: 'relative',
            width: 24,
          }}
        >
          <Box
            sx={(theme) => ({
              inset: 0,
              opacity: copied ? 0 : 1,
              position: 'absolute',
              transform: copied ? 'scale(0.7)' : 'scale(1)',
              transition: theme.transitions.create(['opacity', 'transform'], {
                duration: theme.transitions.duration.shorter,
              }),
              '@media (prefers-reduced-motion: reduce)': {
                transition: 'none',
              },
            })}
          >
            <CopyIcon />
          </Box>
          <Box
            sx={(theme) => ({
              inset: 0,
              opacity: copied ? 1 : 0,
              position: 'absolute',
              transform: copied ? 'scale(1)' : 'scale(0.7)',
              transition: theme.transitions.create(['opacity', 'transform'], {
                duration: theme.transitions.duration.shorter,
              }),
              '@media (prefers-reduced-motion: reduce)': {
                transition: 'none',
              },
            })}
          >
            <CheckIcon />
          </Box>
        </Box>
      </IconButton>
      <OutputFeedback id={feedbackId} message="Copied to clipboard!" visible={copied} />
    </Box>
  )
}
