import { useState, useEffect } from 'react'
import { useIME } from '../hooks/useIME'
import { TextField } from '@mui/material'
import { Box } from '@mui/material'
import { Typography } from '@mui/material'
import { CandidatesMenu } from './CandidatesMenu'



export function MaterialIME() {
  const {
    inputString,
    outputString,
    onChange,
    candidates,
    selectCandidate,
    selectedIndex,
    handleKeyDown,
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
