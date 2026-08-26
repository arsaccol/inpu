import { Paper, Popper } from '@mui/material'
import { CandidateMenuItem } from './CandidateMenuItem'
import { useRef, useEffect } from 'react'
import { HieroglyphModel } from '../models/Hieroglyph.type'

export interface CandidatesMenuProps {
  anchorElement: HTMLElement | null;
  candidates: HieroglyphModel[];
  selectedIndex: number;
  selectCandidate: (candidate: HieroglyphModel) => void;
}

export function CandidatesMenu(props: CandidatesMenuProps) {
  const {
    anchorElement,
    candidates,
    selectedIndex,
    selectCandidate,
  } = props

  const selectedRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if(selectedRef.current) {
      selectedRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [selectedIndex])


  return (
    <Popper
      open={Boolean(anchorElement)}
      anchorEl={anchorElement}
      placement="bottom-start"
      popperOptions={{ strategy: 'fixed' }}
      sx={{
        width: anchorElement?.clientWidth,
        zIndex: 10000,
      }}
    >
      <Paper
        role="menu"
        sx={{
          maxHeight: 'min(320px, calc(100dvh - 16px))',
          overflowY: 'auto',
          backgroundColor: 'background.paper',
          color: 'text.primary',
          border: '1px solid var(--border-color)',
        }}
        elevation={3}
      >
      {candidates.map( (candidate, index) => {
          const isSelected = index === selectedIndex
          return (
            <CandidateMenuItem
              key={candidate.id}
              isSelected={isSelected}
              onClick={() => { console.log('onClick candidate', candidate); selectCandidate!(candidate) }}
              candidate={candidate}
              selectedRef={isSelected? selectedRef : null}
            >
            </CandidateMenuItem>
          )
        }
      )}
      </Paper>
    </Popper>

  )

}
