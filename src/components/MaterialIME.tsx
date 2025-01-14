import { useState } from 'react'
import { useIME } from '../hooks/useIME'
import { TextField } from '@mui/material'
import { MenuItem } from '@mui/material'
import { Box } from '@mui/material'
import { Paper } from '@mui/material'
import { Typography } from '@mui/material'



export function MaterialIME() {
  const {
    inputString,
      outputString,
      handleInput,
      handleKeyDown,
      candidates,
      selectCandidate
  } = useIME()

  function handleFocus() {
    if(candidates.length > 0) {
      setIsMenuVisible(true)
    }
  }

  function handleBlur() {
    setTimeout( () => setIsMenuVisible(false), 100 )
  }

  const [isMenuVisible, setIsMenuVisible] = useState(false)

  return (
    <Box sx={{ position: 'relative', display: 'inline-block', width: '100%' }}>
      <div style={{ marginTop: '8px', fontSize: '14px' }}>
      </div>
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
        onChange={handleInput}
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
      {isMenuVisible && candidates.length > 0 && (
        <Paper 
          sx={{
            position: 'absolute',
            top: '100%',
            width: '100%',
            left: '0',
            right: '0',
            zIndex: 10000,
            maxHeight: '150px',
            overflowY: 'auto',
            backgroundColor: 'var(--background-color)',
            color: 'var(--text-color)',
            border: '1px solid var(--border-color)',
          }}
          elevation={3}
        >
        {candidates.map( (candidate, index) => (
              <MenuItem
                key={index}
                onClick={() => selectCandidate(candidate)}
                sx={{
                  cursor: 'pointer',
                }}
              >
                {candidate}
              </MenuItem>
        ))}
        </Paper>

    )}
  </Box>
  )

}
