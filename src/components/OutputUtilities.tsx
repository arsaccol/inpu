import { Box } from '@mui/material'
import { useEffect, useRef } from 'react'
import { ClearButton } from './ClearButton'
import { CopyButton } from './CopyButton'
import { isMacOS } from '../platform'

export interface OutputUtilitiesProps {
  onClear: () => void
  value: string
  canClear?: boolean
  preserveTextSelection?: boolean
}

export function OutputUtilities({ onClear, value, canClear, preserveTextSelection = false }: OutputUtilitiesProps) {
  const copyButtonRef = useRef<HTMLButtonElement>(null)
  const clearButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    function handleOutputShortcut(e: KeyboardEvent) {
      const copyModifierPressed = isMacOS() ? e.metaKey : e.ctrlKey

      if (copyModifierPressed && e.key.toLowerCase() === 'c') {
        if (preserveTextSelection) {
          const target = e.target
          const inputSelection = (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)
            && target.selectionStart !== target.selectionEnd
          const selection = window.getSelection()
          if (inputSelection || (selection && !selection.isCollapsed) || e.defaultPrevented) return
        }
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
  }, [preserveTextSelection])

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
      <ClearButton buttonRef={clearButtonRef} disabled={!(canClear ?? !!value)} onClear={onClear} />
    </Box>
  )
}
