import { IconButton, SvgIcon, SvgIconProps } from '@mui/material'

export interface ClearButtonProps {
  disabled: boolean
  onClear: () => void
}

function DeleteIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12ZM8 9h8v10H8V9Zm7.5-5-1-1h-5l-1 1H5v2h14V4h-3.5Z" />
    </SvgIcon>
  )
}

export function ClearButton({ disabled, onClear }: ClearButtonProps) {
  return (
    <IconButton
      aria-label="Clear hieroglyph output"
      disabled={disabled}
      disableRipple
      onClick={onClear}
      size="small"
      title="Clear output"
      sx={{
        color: 'text.primary',
        height: 34,
        '&:hover': {
          backgroundColor: 'action.hover',
          color: 'error.light',
        },
        '&.Mui-focusVisible': {
          outline: '2px solid currentColor',
          outlineOffset: 2,
        },
        width: 34,
      }}
    >
      <DeleteIcon sx={{ fontSize: 28 }} />
    </IconButton>
  )
}
