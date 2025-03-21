import { Paper } from '@mui/material'
import { CandidateMenuItem } from './CandidateMenuItem'
import { RefObject } from 'react'
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
    {candidates.map( (candidate, index) => (
          <CandidateMenuItem
            key={candidate.id}
            isSelected={index === selectedIndex}
            onClick={() => { console.log('onClick candidate', candidate); selectCandidate!(candidate) }}
            candidate={candidate}
          >
          </CandidateMenuItem>
    ))}
    </Paper>

  )

}
