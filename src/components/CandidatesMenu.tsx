import { Paper, Popper } from '@mui/material'
import { CandidateMenuItem } from './CandidateMenuItem'
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { HieroglyphModel } from '../models/Hieroglyph.type'

export interface CandidatesMenuProps {
  anchorElement: HTMLElement | null;
  candidates: HieroglyphModel[];
  selectedIndex: number;
  selectCandidate: (candidate: HieroglyphModel) => void;
}

export interface CandidatesMenuHandle {
  scrollByPage: (direction: -1 | 1) => number | null
}

export const CandidatesMenu = forwardRef<CandidatesMenuHandle, CandidatesMenuProps>(function CandidatesMenu(props, ref) {
  const {
    anchorElement,
    candidates,
    selectedIndex,
    selectCandidate,
  } = props

  const menuRef = useRef<HTMLDivElement | null>(null)
  const selectedRef = useRef<HTMLDivElement | null>(null)
  const isPagingRef = useRef(false)

  useImperativeHandle(ref, () => ({
    scrollByPage(direction) {
      const menu = menuRef.current
      if (!menu) return null

      const nextScrollTop = Math.max(
        0,
        Math.min(
          menu.scrollTop + direction * menu.clientHeight * 0.75,
          menu.scrollHeight - menu.clientHeight,
        ),
      )

      isPagingRef.current = true
      menu.scrollTo({ behavior: 'smooth', top: nextScrollTop })

      const firstVisibleIndex = Array.from(menu.children).findIndex((item) => (
        item instanceof HTMLElement
        && item.offsetTop + item.offsetHeight > nextScrollTop
      ))

      if (firstVisibleIndex < 0) return null

      return Math.min(firstVisibleIndex + 1, menu.children.length - 1)
    },
  }), [])

  useEffect(() => {
    if (isPagingRef.current) {
      isPagingRef.current = false
      return
    }

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
        ref={menuRef}
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

})
