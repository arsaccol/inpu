import { Paper } from '@mui/material'
import { CandidateMenuItem } from './CandidateMenuItem'
import { useRef, useEffect } from 'react'
import { HieroglyphModel } from '../models/Hieroglyph.type'

export interface CandidatesMenuProps {
  candidates: any[];
  selectedIndex: number;
  selectCandidate: (candidate: HieroglyphModel) => void;
}

export function CandidatesMenu(props: CandidatesMenuProps) {
  const {
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
    <Paper 
      role="menu"
      sx={{
        position: 'absolute',
        top: '100%',
        width: '100%',
        left: '0',
        right: '0',
        zIndex: 10000,
        maxHeight: '400px',
        overflowY: 'auto',
        backgroundColor: 'var(--background-color)',
        color: 'var(--text-color)',
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

  )

}
