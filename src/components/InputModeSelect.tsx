import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import { FormControl } from '@mui/material'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { InputMode } from '../hooks/useIME'

export interface InputModeSelectProps {
  selectedInputMode: InputMode,
  setSelectedInputMode: (inputMode: InputMode) => void,
}

export function InputModeSelect(props: InputModeSelectProps) {
  const handleChange = (event: SelectChangeEvent) => {
    props.setSelectedInputMode(event.target.value as InputMode)
  }

  return (
      <div style={{ display: "flex", minWidth: "175px", /*backgroundColor: "red"*/}}>
      <FormControl fullWidth sx={{
        width: '10em',
        backgroundColor: 'var(--background-color-brighter)',
        color: 'var(--text-color)',
        borderColor: 'var(--border-color)',
        borderRadius: '5px',
      }}>
        <InputLabel 
          id="input-mode-select-label"
           sx={{
            color: 'var(--text-color)', // Ensure label color is set
            '&.Mui-focused': { color: 'var(--text-color)' }, // Keep label color when focused
          }}
        >Input Mode</InputLabel>
        <Select 
          labelId="input-mode-select-label"
          id="input-mode-select"
          value={props.selectedInputMode}
          onChange={handleChange}
          label="Input Mode"
          sx={{
            backgroundColor: 'var(--background-color-brighter)',
            color: 'var(--text-color)',
            '& .MuiSelect-icon': {
              color: 'var(--text-color)', // Ensures the dropdown arrow is the correct color
            },
          }}

          MenuProps={{
            PaperProps: {
              sx: {
                backgroundColor: 'var(--background-color-brighter) !important',
                color: 'var(--text-color) !important',
                '& .MuiMenuItem-root': {
                  color: 'var(--text-color) !important',
                }

              }
            }
            
          }}
        >
        {
          Object.values(InputMode).map((inputMode: string) => 
              <MenuItem 
                value={inputMode}
                sx={{
                  backgroundColor: 'var(--background-color-brighter)',
                  color: 'var(--text-color)',
                  '&:hover': {
                    backgroundColor: 'var(--background-color-darker)',
                  },
                }}
              >{inputMode}
              </MenuItem>
          )
        }
        </Select>
      </FormControl>
    </div>
  )
}
