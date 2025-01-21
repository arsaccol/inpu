import { MenuItem } from "@mui/material"
import { HieroglyphModel } from "../models/Hieroglyph.type"

type CandidateMenuItemProps = {
  candidate: HieroglyphModel,
  onClick: () => void;
}

export function CandidateMenuItem(props: CandidateMenuItemProps) {

  return (
    <MenuItem
      onClick={props.onClick}
      sx={{
        cursor: 'pointer',
      }}
    >
      {props.candidate.glyph}
    </MenuItem>
  )
}
