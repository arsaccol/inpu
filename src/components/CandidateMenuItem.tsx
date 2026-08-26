import { MenuItem } from "@mui/material"
import { HieroglyphModel } from "../models/Hieroglyph.type"
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
        alignItems: 'center',
        columnGap: { xs: 1, sm: 1.5 },
        cursor: 'pointer',
        display: 'grid',
        gridTemplateColumns: {
          xs: '48px 36px 54px minmax(0, 1fr)',
          sm: '56px 42px 62px minmax(0, 1fr)',
        },
        backgroundColor: props.isSelected
        ? 'var(--selected-bg-color)'
        : 'inherit',
        '&:hover': {
          backgroundColor: 'var(--hover-bg-color)'
        }
      }}
    >
      <Typography
        variant="h3"
        sx={{
          fontWeight: 'bold',
          lineHeight: 1,
        }}
      >
        {props.candidate.glyph}
      </Typography>
      <Typography sx={{ whiteSpace: 'nowrap' }}>
        {props.candidate.transliteration}
      </Typography>
      <Typography sx={{ whiteSpace: 'nowrap' }}>
        [{props.candidate.gardiner_code}]
      </Typography>
      <Typography sx={{ minWidth: 0, overflowWrap: 'anywhere' }}>
        ({props.candidate.name})
      </Typography>
    </MenuItem>
    </div>
  )
}
