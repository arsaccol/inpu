import { Box } from '@mui/material'
import { useEffect, useRef } from 'react'
import { ClearButton } from './ClearButton'
import { CopyButton } from './CopyButton'
import { isMacOS } from '../platform'

export interface OutputUtilitiesProps {
  onClear: () => void
  value: string
}

export function OutputUtilities({ onClear, value }: OutputUtilitiesProps) {
  const copyButtonRef = useRef<HTMLButtonElement>(null)
  const clearButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    function handleOutputShortcut(e: KeyboardEvent) {
      const copyModifierPressed = isMacOS() ? e.metaKey : e.ctrlKey

      if (copyModifierPressed && e.key.toLowerCase() === 'c') {
        e.preventDefault()
        copyButtonRef.current?.click()
        return
      }

      if (e.shiftKey && e.key === 'Delete') {
        e.preventDefault()
        clearButtonRef.current?.click()
      }
    }

    document.addEventListener('keydown', handleOutputShortcut)

    return () => document.removeEventListener('keydown', handleOutputShortcut)
  }, [])

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
      <CopyButton buttonRef={copyButtonRef} value={value} />
      <ClearButton buttonRef={clearButtonRef} disabled={!value} onClear={onClear} />
    </Box>
  )
}
