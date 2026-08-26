import { Box } from '@mui/material'
import { ClearButton } from './ClearButton'
import { CopyButton } from './CopyButton'

export interface OutputUtilitiesProps {
  onClear: () => void
  value: string
}

export function OutputUtilities({ onClear, value }: OutputUtilitiesProps) {
  return (
    <Box
      sx={{
        alignItems: 'center',
        backgroundColor: 'transparent',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        boxShadow: 1,
        display: 'flex',
        gap: 0.5,
        lineHeight: 0,
        position: 'absolute',
        px: 0.75,
        py: 0.25,
        right: 8,
        top: 8,
      }}
    >
      <CopyButton value={value} />
      <ClearButton disabled={!value} onClear={onClear} />
    </Box>
  )
}
