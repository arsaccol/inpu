import { useState, useEffect } from 'react'
import { useIME } from '../hooks/useIME'
import { TextField } from '@mui/material'
import { Box } from '@mui/material'
import { Typography } from '@mui/material'
import { CandidatesMenu } from './CandidatesMenu'
import { InputModeSelect } from './InputModeSelect'



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
    <Box sx={{ position: 'relative', display: 'inline-block', width: '100%' }}>
      <Box sx={{
          height: 100,
          overflowWrap: 'break-word',
          backgroundColor: 'var(--background-color)',
          border: '1px solid var(--background-color)',
          padding: 1,
          marginBottom: 2
        }}
      >
        <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
          {outputString}
        </Typography>
      </Box>
      <Box sx={{
        display: "flex", 
        flexDirection: {xs: "column", sm: "row"}, 
        alignItems: {xs: "flex-start", sm:"center" }, 
        gap: "20px",
      }}>
        <InputModeSelect 
          selectedInputMode={selectedInputMode} 
          setSelectedInputMode={setSelectedInputMode}
        />
        <TextField
          label=""
          variant="outlined"
          value={inputString}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          fullWidth
          InputProps={{
            sx: {
              backgroundColor: 'var(--background-color-brighter)',
              color: 'var(--text-color)',
              borderColor: 'var(--border-color)',
            }
          }}
        />
      </Box>
      {isMenuVisible && candidates!.length > 0 && (
        <CandidatesMenu 
          candidates={candidates} 
          selectedIndex={selectedIndex}
          selectCandidate={selectCandidate}
        />
    )}
  </Box>
  )

}
