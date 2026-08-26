import { Typography } from '@mui/material'

export interface GardinerCodeBadgeProps {
  code: string
}

export function GardinerCodeBadge({ code }: GardinerCodeBadgeProps) {
  return (
    <Typography
      component="span"
      sx={{
        backgroundColor: 'action.hover',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 0.75,
        boxSizing: 'border-box',
        color: 'text.secondary',
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
        fontSize: '0.8rem',
        fontWeight: 600,
        justifySelf: 'start',
        lineHeight: 1.4,
        minWidth: '3.25rem',
        px: 0.75,
        py: 0.25,
        textAlign: 'center',
        whiteSpace: 'nowrap',
      }}
    >
      {code}
    </Typography>
  )
}
