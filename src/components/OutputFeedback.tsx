import { Box } from '@mui/material'

export interface OutputFeedbackProps {
  id: string
  message: string
  visible: boolean
}

export function OutputFeedback({ id, message, visible }: OutputFeedbackProps) {
  return (
    <Box
      aria-hidden={!visible}
      id={id}
      role="status"
      sx={(theme) => ({
        backgroundColor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        boxShadow: theme.shadows[4],
        color: 'text.primary',
        fontSize: '0.75rem',
        fontWeight: 500,
        lineHeight: 1.4,
        opacity: visible ? 1 : 0,
        pointerEvents: 'none',
        position: 'absolute',
        px: 1.25,
        py: 0.75,
        right: 0,
        top: 'calc(100% + 8px)',
        transform: visible ? 'translateY(0)' : 'translateY(-4px)',
        transition: theme.transitions.create(['opacity', 'transform'], {
          duration: theme.transitions.duration.shorter,
        }),
        whiteSpace: 'nowrap',
        zIndex: 1,
        '&::before': {
          backgroundColor: 'background.paper',
          borderLeft: '1px solid',
          borderTop: '1px solid',
          borderColor: 'divider',
          content: '""',
          height: 8,
          position: 'absolute',
          right: 10,
          top: -5,
          transform: 'rotate(45deg)',
          width: 8,
        },
        '@media (prefers-reduced-motion: reduce)': {
          transition: 'none',
        },
      })}
    >
      {message}
    </Box>
  )
}
