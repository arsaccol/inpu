import { Box, Paper, Popper } from '@mui/material'
import { CandidateMenuItem } from './CandidateMenuItem'
import { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react'
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

const estimatedCandidateHeight = 76
const candidateOverscan = 3

type CandidateRow = {
  height: number
  index: number
  top: number
}

function getCandidateRows(candidates: HieroglyphModel[], rowHeights: Map<number, number>) {
  let top = 0

  return candidates.map((_candidate, index) => {
    const height = rowHeights.get(index) ?? estimatedCandidateHeight
    const row = { height, index, top }
    top += height
    return row
  })
}

function getVisibleCandidateIndexes(rows: CandidateRow[], scrollTop: number, viewportHeight: number) {
  return rows
    .filter((row) => row.top + row.height > scrollTop && row.top < scrollTop + viewportHeight)
    .map((row) => row.index)
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
  const rowElements = useRef(new Map<number, HTMLDivElement>())
  const rowIndexes = useRef(new Map<HTMLDivElement, number>())
  const rowObserver = useRef<ResizeObserver | null>(null)
  const [rowHeights, setRowHeights] = useState(new Map<number, number>())
  const [scrollTop, setScrollTop] = useState(0)
  const [viewportHeight, setViewportHeight] = useState(320)
  const candidateRows = getCandidateRows(candidates, rowHeights)
  const visibleCandidateIndexes = getVisibleCandidateIndexes(candidateRows, scrollTop, viewportHeight)
  const firstVisibleIndex = visibleCandidateIndexes[0] ?? 0
  const lastVisibleIndex = visibleCandidateIndexes.at(-1) ?? 0
  const renderStartIndex = Math.max(0, Math.min(firstVisibleIndex - candidateOverscan, selectedIndex))
  const renderEndIndex = Math.min(
    candidates.length - 1,
    Math.max(lastVisibleIndex + candidateOverscan, selectedIndex),
  )
  const lastCandidateRow = candidateRows.at(-1)
  const totalHeight = lastCandidateRow ? lastCandidateRow.top + lastCandidateRow.height : 0

  function registerCandidateItem(index: number, element: HTMLDivElement | null) {
    const previousElement = rowElements.current.get(index)

    if (previousElement === element) return

    if (previousElement) {
      rowObserver.current?.unobserve(previousElement)
      rowIndexes.current.delete(previousElement)
    }

    if (!element) {
      rowElements.current.delete(index)
      return
    }

    rowElements.current.set(index, element)
    rowIndexes.current.set(element, index)
    rowObserver.current?.observe(element)

    if (index === selectedIndex) {
      selectedRef.current = element
    }
  }

  function updateViewport(menu: HTMLDivElement) {
    setScrollTop(menu.scrollTop)
    setViewportHeight(menu.clientHeight)
  }

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      setRowHeights((currentRowHeights) => {
        let hasChanged = false
        const nextRowHeights = new Map(currentRowHeights)

        for (const entry of entries) {
          const index = rowIndexes.current.get(entry.target as HTMLDivElement)
          const height = Math.ceil(entry.contentRect.height)

          if (index !== undefined && nextRowHeights.get(index) !== height) {
            nextRowHeights.set(index, height)
            hasChanged = true
          }
        }

        return hasChanged ? nextRowHeights : currentRowHeights
      })
    })

    rowObserver.current = observer
    rowElements.current.forEach((element) => observer.observe(element))

    return () => observer.disconnect()
  }, [])

  useImperativeHandle(ref, () => ({
    getVisibleCandidateIndex(shortcutIndex) {
      return visibleCandidateIndexes[shortcutIndex] ?? null
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

      menu.scrollTo({ behavior: 'smooth', top: nextScrollTop })
      const nextVisibleCandidateIndexes = getVisibleCandidateIndexes(
        candidateRows,
        nextScrollTop,
        menu.clientHeight,
      )
      const nextFirstVisibleIndex = nextVisibleCandidateIndexes[0]

      return nextFirstVisibleIndex === undefined
        ? null
        : Math.min(nextFirstVisibleIndex + 1, candidates.length - 1)
    },
  }), [candidateRows, candidates.length, visibleCandidateIndexes])

  useEffect(() => {
    if(selectedRef.current) {
      selectedRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [selectedIndex])

  useLayoutEffect(() => {
    setRowHeights(new Map())
    setScrollTop(0)
    menuRef.current?.scrollTo({ top: 0 })
  }, [candidates])

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
        onScroll={(e) => updateViewport(e.currentTarget)}
        sx={{
          maxHeight: 'min(320px, calc(100dvh - 16px))',
          overflowY: 'auto',
          backgroundColor: 'background.paper',
          color: 'text.primary',
          border: '1px solid var(--border-color)',
        }}
        elevation={3}
      >
      <Box sx={{ height: totalHeight, position: 'relative' }}>
      {candidateRows.slice(renderStartIndex, renderEndIndex + 1).map((row) => {
          const candidate = candidates[row.index]
          const index = row.index
          const isSelected = index === selectedIndex
          const shortcutIndex = visibleCandidateIndexes.indexOf(index)
          const shortcutLabel = showShortcuts && shortcutIndex >= 0 && shortcutIndex < 10
            ? shortcutIndex === 9 ? '0' : String(shortcutIndex + 1)
            : ''
          return (
            <Box
              key={candidate.id}
              sx={{ left: 0, position: 'absolute', right: 0, top: row.top }}
            >
              <CandidateMenuItem
                itemRef={(element) => registerCandidateItem(index, element)}
                isSelected={isSelected}
                onClick={() => { console.log('onClick candidate', candidate); selectCandidate!(candidate) }}
                candidate={candidate}
                shortcutLabel={shortcutLabel}
              />
            </Box>
          )
        }
      )}
      </Box>
      </Paper>
    </Popper>

  )

})
