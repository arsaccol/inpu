import { useState, useEffect, useRef } from 'react'
import { InputMode, useIME } from '../hooks/useIME'
import { TextField } from '@mui/material'
import { Box } from '@mui/material'
import { CandidatesMenu } from './CandidatesMenu'
import { InputModeSelect } from './InputModeSelect'
import { HieroglyphOutput } from './HieroglyphOutput'

const inputModePlaceholders: Record<InputMode, string> = {
  [InputMode.PHONOGRAM]: 'Try “anx”',
  [InputMode.GARDINER]: 'Try “Y3”',
  [InputMode.KEYWORDS]: 'Try “man”',
}


export function MaterialIME() {
  const {
    inputString,
    outputString,
    onChange,
    candidates,
    selectCandidate,
    selectedIndex,
    handleKeyDown,
    selectedInputMode,
    setSelectedInputMode,
  } = useIME()

  const [isFocused, setIsFocused] = useState(false)
  const [isMenuVisible, setIsMenuVisible] = useState(false)
  const inputAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsMenuVisible(isFocused && candidates.length > 0)
  }, [isFocused, candidates])


  function handleFocus() {
    setIsFocused(true)
  }

  function handleBlur(e: React.FocusEvent) {
    const relatedTarget = e.relatedTarget as HTMLElement
      if(!relatedTarget?.closest('[role="menu"]')) {
        setIsFocused(false)
      }
  }


  return (
    <Box sx={{
      display: 'block',
      maxWidth: '100%',
      mx: 'auto',
      position: 'relative',
      textAlign: 'left',
      width: { xs: '100%', sm: '445px' },
    }}>
      <HieroglyphOutput value={outputString} />
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
          placeholder={inputModePlaceholders[selectedInputMode]}
          variant="outlined"
          value={inputString}
          onChange={onChange}
          onKeyDown={handleKeyDown}
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
          anchorElement={inputAreaRef.current}
          candidates={candidates} 
          selectedIndex={selectedIndex}
          selectCandidate={selectCandidate}
        />
    )}
  </Box>
  )

}
