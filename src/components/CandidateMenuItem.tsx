import { MenuItem } from "@mui/material"
import { HieroglyphModel } from "../models/Hieroglyph.type"
import { Stack } from "@mui/material"
import { Typography }  from "@mui/material"
import { RefObject } from 'react'

type CandidateMenuItemProps = {
  candidate: HieroglyphModel,
  onClick: () => void;
  isSelected?: boolean;
  selectedRef?: RefObject<HTMLDivElement | null> | null;
}


export function CandidateMenuItem(props: CandidateMenuItemProps) {
  return (
    <div ref={props.selectedRef}>
    <MenuItem
      onClick={props.onClick}
      sx={{
        cursor: 'pointer',
        backgroundColor: props.isSelected
        ? 'var(--selected-bg-color)'
        : 'inherit',
        '&:hover': {
          backgroundColor: 'var(--hover-bg-color)'
        }
      }}
    >
    <Stack direction='row' spacing={3}>
      <div>
        <Typography variant="h3" sx={{ fontWeight: 'bold'}}>
          {props.candidate.glyph}
        </Typography>
      </div>
      <div>
        <Typography>
          {props.candidate.transliteration}
        </Typography>
      </div>
      <div>
        <Typography>
          [{props.candidate.gardiner_code}]
        </Typography>
      </div>
      <div>
        <Typography>
          ({props.candidate.name})
        </Typography>
      </div>
    
    </Stack>
    </MenuItem>
    </div>
  )
}
