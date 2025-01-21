import { MenuItem } from "@mui/material"
import { HieroglyphModel } from "../models/Hieroglyph.type"
import { Stack } from "@mui/material"
import { Typography }  from "@mui/material"

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
  )
}
