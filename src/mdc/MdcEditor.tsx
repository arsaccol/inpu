import type { Dispatch, ReactNode, Ref, SetStateAction } from 'react'
import { Box, TextField, Typography } from '@mui/material'
import { OutputUtilities } from '../components/OutputUtilities'
import { MdcPreview } from './MdcPreview'
import { updateMdcDraft } from './mdcState'
import type { MdcDraft } from './mdcState'

interface MdcEditorProps {
  draft: MdcDraft
  setDraft: Dispatch<SetStateAction<MdcDraft>>
  modeSelector: ReactNode
  inputRef: Ref<HTMLInputElement | HTMLTextAreaElement>
}

export default function MdcEditor({ draft, setDraft, modeSelector, inputRef }: MdcEditorProps) {
  const invalid = draft.status === 'invalid'
  function clear() {
    setDraft({ source: '', unicode: '', warnings: [], status: 'empty' })
  }

  return (
    <>
      <Box sx={{
        boxSizing: 'border-box', direction: 'ltr', mb: 3,
        minHeight: { xs: 'calc(4.5 * 2.25rem + 16px)', sm: 'calc(4.5 * 3rem + 16px)' },
        mt: { xs: 6, sm: 8 }, position: 'relative', textAlign: 'left', width: '100%',
      }}>
        <MdcPreview unicode={draft.unicode} />
        <OutputUtilities
          value={draft.unicode}
          onClear={clear}
          canClear={draft.source.length > 0}
          preserveTextSelection
        />
        {invalid && draft.unicode && (
          <Typography role="status" variant="caption" color="text.secondary">
            Showing the last valid composition. Copy uses this output.
          </Typography>
        )}
      </Box>
      <Box sx={{
        display: 'flex', flexDirection: { xs: 'column', sm: 'row' },
        alignItems: 'flex-start', gap: '20px', width: '100%',
      }}>
        {modeSelector}
        <TextField
          autoFocus
          inputRef={inputRef}
          multiline
          minRows={1}
          maxRows={5}
          placeholder="Try “A1:O1”"
          value={draft.source}
          onChange={event => {
            const source = event.target.value
            setDraft(previous => updateMdcDraft(previous, source))
          }}
          error={invalid}
          helperText={invalid ? draft.error : 'Examples: A1:O1 (vertical), W24*Z7 (horizontal)'}
          sx={{ flex: 1, minWidth: 0, width: { xs: '100%', sm: '250px' } }}
          InputProps={{ sx: {
            backgroundColor: 'var(--background-color-brighter)',
            color: 'var(--text-color)',
          } }}
          inputProps={{ 'aria-label': 'Manuel de Codage input', spellCheck: false, autoCapitalize: 'off' }}
          FormHelperTextProps={{ role: invalid ? 'status' : undefined }}
        />
      </Box>
      {!invalid && draft.warnings.length > 0 && (
        <Typography component="p" variant="caption" color="text.secondary" role="status" sx={{ mt: 1 }}>
          {draft.warnings.join(' ')}
        </Typography>
      )}
    </>
  )
}
