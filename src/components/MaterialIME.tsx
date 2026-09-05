import { useState, useEffect, useRef } from 'react'
import { InputMode, useIME } from '../hooks/useIME'
import { TextField } from '@mui/material'
import { Box } from '@mui/material'
import { CandidatesMenu, CandidatesMenuHandle } from './CandidatesMenu'
import { InputModeSelect } from './InputModeSelect'
import { HieroglyphOutput } from './HieroglyphOutput'

const inputModePlaceholders: Record<InputMode, string> = {
  [InputMode.PHONOGRAM]: 'Try “anx”',
  [InputMode.GARDINER]: 'Try “Y3”',
  [InputMode.KEYWORDS]: 'Try “man”',
}

const inputModes = Object.values(InputMode)

export function MaterialIME() {
  const {
    inputString,
    outputHieroglyphs,
    outputString,
    onChange,
    clearOutput,
    candidates,
    selectCandidate,
    selectedIndex,
    setSelectedCandidateIndex,
    handleKeyDown,
    selectedInputMode,
    setSelectedInputMode,
  } = useIME()

  const [isFocused, setIsFocused] = useState(false)
  const [isMenuVisible, setIsMenuVisible] = useState(false)
  const inputAreaRef = useRef<HTMLDivElement>(null)
  const textInputRef = useRef<HTMLInputElement>(null)
  const candidatesMenuRef = useRef<CandidatesMenuHandle>(null)

  useEffect(() => {
    setIsMenuVisible(isFocused && candidates.length > 0)
  }, [isFocused, candidates])

  useEffect(() => {
    function cycleInputMode(e: KeyboardEvent) {
      if (e.key !== 'Tab') return

      e.preventDefault()

      const currentIndex = inputModes.indexOf(selectedInputMode)
      const direction = e.shiftKey ? -1 : 1
      const nextIndex = (currentIndex + direction + inputModes.length) % inputModes.length

      setSelectedInputMode(inputModes[nextIndex])
      textInputRef.current?.focus()
    }

    document.addEventListener('keydown', cycleInputMode)

    return () => document.removeEventListener('keydown', cycleInputMode)
  }, [selectedInputMode, setSelectedInputMode])

  function handleFocus() {
    setIsFocused(true)
  }

  function handleBlur(e: React.FocusEvent) {
    const relatedTarget = e.relatedTarget as HTMLElement
      if(!relatedTarget?.closest('[role="menu"]')) {
        setIsFocused(false)
    }
  }

  function handleInputKeyDown(e: React.KeyboardEvent) {
    if (e.key === ' ') {
      e.preventDefault()

      if (isMenuVisible) {
        setSelectedCandidateIndex((selectedIndex + 1) % candidates.length)
      }

      return
    }

    if (isMenuVisible && (e.key === 'PageDown' || e.key === 'PageUp')) {
      e.preventDefault()
      const nextIndex = candidatesMenuRef.current?.scrollByPage(e.key === 'PageDown' ? 1 : -1)

      if (nextIndex !== null && nextIndex !== undefined && nextIndex >= 0) {
        setSelectedCandidateIndex(nextIndex)
      }

      return
    }

    if (
      isMenuVisible
      && selectedInputMode !== InputMode.GARDINER
      && /^[0-9]$/.test(e.key)
    ) {
      e.preventDefault()

      const shortcutIndex = e.key === '0' ? 9 : Number(e.key) - 1
      const candidateIndex = candidatesMenuRef.current?.getVisibleCandidateIndex(shortcutIndex)

      if (candidateIndex !== null && candidateIndex !== undefined) {
        selectCandidate(candidates[candidateIndex])
      }

      return
    }

    handleKeyDown(e)
  }


  return (
    <Box sx={{
      display: 'block',
      maxWidth: '100%',
      mx: 'auto',
      position: 'relative',
      textAlign: 'left',
      width: { xs: '100%', sm: '520px' },
    }}>
      <HieroglyphOutput glyphs={outputHieroglyphs} value={outputString} onClear={clearOutput} />
      <Box ref={inputAreaRef} sx={{
        display: "flex", 
        flexDirection: {xs: "column", sm: "row"}, 
        alignItems: {xs: "flex-start", sm:"center" }, 
        gap: "20px",
        width: '100%',
      }}>
        <InputModeSelect 
          selectedInputMode={selectedInputMode} 
          setSelectedInputMode={setSelectedInputMode}
        />
        <TextField
          autoFocus
          inputRef={textInputRef}
          placeholder={inputModePlaceholders[selectedInputMode]}
          variant="outlined"
          value={inputString}
          onChange={onChange}
          onKeyDown={handleInputKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          sx={{
            flex: { xs: '0 0 auto', sm: '0 0 250px' },
            maxWidth: '100%',
            width: '250px',
          }}
          InputProps={{
            sx: {
              backgroundColor: 'var(--background-color-brighter)',
              color: 'var(--text-color)',
              borderColor: 'var(--border-color)',
              '& .MuiInputBase-input::placeholder': {
                color: 'text.secondary',
                opacity: 1,
              },
            }
          }}
          inputProps={{
            'aria-label': `${selectedInputMode} input`,
          }}
        />
      </Box>
      {isMenuVisible && candidates!.length > 0 && (
        <CandidatesMenu 
          ref={candidatesMenuRef}
          anchorElement={inputAreaRef.current}
          candidates={candidates} 
          selectedIndex={selectedIndex}
          selectCandidate={selectCandidate}
          showShortcuts={selectedInputMode !== InputMode.GARDINER}
        />
    )}
  </Box>
  )

}
