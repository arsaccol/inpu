import { MenuItem } from "@mui/material"
import { HieroglyphModel } from "../models/Hieroglyph.type"

type CandidateMenuItemProps = {
  candidate: HieroglyphModel,
  key?: number;
  onClick: () => void;
}

export function CandidateMenuItem(props: CandidateMenuItemProps) {

  return (
    <MenuItem
      key={props?.key}
      onClick={props.onClick}
      sx={{
        cursor: 'pointer',
      }}
    >
      {props.candidate.glyph}
    </MenuItem>
  )
}
