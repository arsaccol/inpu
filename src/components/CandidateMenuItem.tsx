import { MenuItem } from "@mui/material"
import { HieroglyphModel } from "../models/Hieroglyph.type"
import { Typography }  from "@mui/material"
import { RefObject } from 'react'
import { GardinerCodeBadge } from './GardinerCodeBadge'

type CandidateMenuItemProps = {
  candidate: HieroglyphModel,
  onClick: () => void;
  isSelected?: boolean;
  selectedRef?: RefObject<HTMLDivElement | null> | null;
  shortcutLabel: string;
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
          xs: '28px 56px 36px 54px minmax(0, 1fr)',
          sm: '32px 68px 42px 62px minmax(0, 1fr)',
        },
        py: { xs: 1, sm: 1.25 },
        backgroundColor: props.isSelected
        ? 'var(--selected-bg-color)'
        : 'inherit',
        '&:hover': {
          backgroundColor: 'var(--hover-bg-color)'
        }
      }}
    >
      <Typography
        aria-hidden="true"
        color="text.secondary"
        sx={{
          alignItems: 'center',
          display: 'flex',
          fontVariantNumeric: 'tabular-nums',
          justifyContent: 'center',
          typography: 'caption',
        }}
      >
        {props.shortcutLabel}
      </Typography>
      <Typography
        variant="h3"
        sx={{
          fontWeight: 'bold',
          lineHeight: 1.15,
        }}
      >
        {props.candidate.glyph}
      </Typography>
      <Typography sx={{ whiteSpace: 'nowrap' }}>
        {props.candidate.transliteration}
      </Typography>
      <GardinerCodeBadge code={props.candidate.gardiner_code} />
      <Typography sx={{ minWidth: 0, overflowWrap: 'anywhere', whiteSpace: 'normal' }}>
        {props.candidate.name}
      </Typography>
    </MenuItem>
    </div>
  )
}
