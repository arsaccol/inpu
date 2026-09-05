import { Paper, Popper } from '@mui/material'
import { CandidateMenuItem } from './CandidateMenuItem'
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { HieroglyphModel } from '../models/Hieroglyph.type'

export interface CandidatesMenuProps {
  anchorElement: HTMLElement | null;
  candidates: HieroglyphModel[];
  selectedIndex: number;
  selectCandidate: (candidate: HieroglyphModel) => void;
  showShortcuts: boolean;
}

export interface CandidatesMenuHandle {
  getVisibleCandidateIndex: (shortcutIndex: number) => number | null
  scrollByPage: (direction: -1 | 1) => number | null
}

function getFirstVisibleCandidateIndex(menu: HTMLDivElement, scrollTop: number) {
  return Array.from(menu.children).findIndex((item) => (
    item instanceof HTMLElement
    && item.offsetTop + item.offsetHeight > scrollTop
  ))
}

function getVisibleCandidateIndexes(menu: HTMLDivElement) {
  return Array.from(menu.children).reduce<number[]>((indexes, item, index) => {
    if (
      item instanceof HTMLElement
      && item.offsetTop + item.offsetHeight > menu.scrollTop
      && item.offsetTop < menu.scrollTop + menu.clientHeight
    ) {
      indexes.push(index)
    }

    return indexes
  }, [])
}

export const CandidatesMenu = forwardRef<CandidatesMenuHandle, CandidatesMenuProps>(function CandidatesMenu(props, ref) {
  const {
    anchorElement,
    candidates,
    selectedIndex,
    selectCandidate,
    showShortcuts,
  } = props

  const menuRef = useRef<HTMLDivElement | null>(null)
  const selectedRef = useRef<HTMLDivElement | null>(null)
  const isPagingRef = useRef(false)
  const [firstVisibleIndex, setFirstVisibleIndex] = useState(0)

  function updateVisibleCandidateLabels() {
    const menu = menuRef.current
    if (!menu) return

    const nextFirstVisibleIndex = getVisibleCandidateIndexes(menu)[0]
    if (nextFirstVisibleIndex !== undefined) {
      setFirstVisibleIndex(nextFirstVisibleIndex)
    }
  }

  useImperativeHandle(ref, () => ({
    getVisibleCandidateIndex(shortcutIndex) {
      const menu = menuRef.current
      if (!menu) return null

      return getVisibleCandidateIndexes(menu)[shortcutIndex] ?? null
    },
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

      const firstVisibleIndex = getFirstVisibleCandidateIndex(menu, nextScrollTop)

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
        '&::before': showShortcuts ? {
          backgroundColor: 'divider',
          bottom: 0,
          content: '""',
          left: { xs: '44px', sm: '48px' },
          pointerEvents: 'none',
          position: 'absolute',
          top: 0,
          width: '1px',
          zIndex: 1,
        } : undefined,
      }}
    >
      <Paper
        ref={menuRef}
        role="menu"
        onScroll={updateVisibleCandidateLabels}
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
          const shortcutIndex = index - firstVisibleIndex
          const shortcutLabel = showShortcuts && shortcutIndex >= 0 && shortcutIndex < 10
            ? shortcutIndex === 9 ? '0' : String(shortcutIndex + 1)
            : ''
          return (
            <CandidateMenuItem
              key={candidate.id}
              isSelected={isSelected}
              onClick={() => { console.log('onClick candidate', candidate); selectCandidate!(candidate) }}
            candidate={candidate}
            selectedRef={isSelected? selectedRef : null}
            shortcutLabel={shortcutLabel}
            >
            </CandidateMenuItem>
          )
        }
      )}
      </Paper>
    </Popper>

  )

})
