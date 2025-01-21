import { MenuItem } from "@mui/material"

type CandidateMenuItemProps = {
  candidateName: string;
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
      {props.candidateName}
    </MenuItem>
  )
}
