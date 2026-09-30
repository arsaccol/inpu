import { Box, Paper, Popper, Stack, Typography } from '@mui/material'
import { HieroglyphModel } from '../models/Hieroglyph.type'
import { GardinerCodeBadge } from './GardinerCodeBadge'

export interface HieroglyphDetailsPopperProps {
  anchorElement: HTMLElement | null
  hieroglyph: HieroglyphModel | null
}

export function HieroglyphDetailsPopper({ anchorElement, hieroglyph }: HieroglyphDetailsPopperProps) {
  return (
    <Popper
      anchorEl={anchorElement}
      open={Boolean(anchorElement && hieroglyph)}
      placement="bottom-start"
      popperOptions={{
        modifiers: [{ name: 'offset', options: { offset: [0, 8] } }],
        strategy: 'fixed',
      }}
      sx={{ pointerEvents: 'none', zIndex: 10000 }}
    >
      {hieroglyph && (
        <Paper
          elevation={4}
          sx={{
            maxWidth: 260,
            pb: 2.5,
            pt: 3,
            px: 2.5,
            width: { xs: 'calc(100vw - 32px)', sm: 260 },
          }}
        >
          <Stack alignItems="center" direction="row" spacing={1.5}>
            <Typography
              aria-hidden="true"
              sx={{
                flex: '0 0 96px',
                fontSize: '5rem',
                lineHeight: 1,
                textAlign: 'center',
              }}
            >
              {hieroglyph.glyph}
            </Typography>
            <Box sx={{ minWidth: 0 }}>
              <Stack alignItems="center" direction="row" spacing={0.75}>
                <Typography fontWeight="bold">{hieroglyph.transliteration}</Typography>
                <GardinerCodeBadge code={hieroglyph.gardiner_code} />
              </Stack>
              <Typography color="text.secondary" sx={{ overflowWrap: 'anywhere' }}>
                {hieroglyph.name}
              </Typography>
            </Box>
          </Stack>
        </Paper>
      )}
    </Popper>
  )
}
