import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Typography,
} from '@mui/material'
import { useDatabase } from '../hooks/useDatabase'
import { HieroglyphModel } from '../models/Hieroglyph.type'

type SortDirection = 'asc' | 'desc'
type ColumnKey = keyof HieroglyphModel

type Column = {
  key: ColumnKey
  label: string
  minWidth?: number
}

const columns: Column[] = [
  { key: 'glyph', label: 'Glyph', minWidth: 90 },
  { key: 'gardiner_code', label: 'Gardiner code', minWidth: 130 },
  { key: 'name', label: 'Name', minWidth: 180 },
  { key: 'category', label: 'Category', minWidth: 140 },
  { key: 'transliteration', label: 'Transliteration', minWidth: 140 },
  { key: 'input_transliteration', label: 'Typed input', minWidth: 120 },
  { key: 'description_words', label: 'Description and keywords', minWidth: 260 },
  { key: 'gardiner_group', label: 'Gardiner group', minWidth: 260 },
  { key: 'composing_glyphs', label: 'Composed from', minWidth: 150 },
  { key: 'id', label: 'Database ID', minWidth: 110 },
]

function compareValues(a: HieroglyphModel, b: HieroglyphModel, key: ColumnKey) {
  const aValue = a[key] ?? ''
  const bValue = b[key] ?? ''

  if (typeof aValue === 'number' && typeof bValue === 'number') {
    return aValue - bValue
  }

  return String(aValue).localeCompare(String(bValue), undefined, {
    numeric: true,
    sensitivity: 'base',
  })
}

export function ReviewPage() {
  const { getAllHieroglyphs, isDatabaseReady } = useDatabase()
  const [sortKey, setSortKey] = useState<ColumnKey>('gardiner_code')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(25)

  const rows = getAllHieroglyphs()
  const sortedRows = useMemo(() => {
    return [...rows].sort((a, b) => {
      const result = compareValues(a, b, sortKey)
      return sortDirection === 'asc' ? result : -result
    })
  }, [rows, sortDirection, sortKey])

  const visibleRows = sortedRows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  )

  function sortBy(key: ColumnKey) {
    const isCurrentAscending = sortKey === key && sortDirection === 'asc'
    setSortKey(key)
    setSortDirection(isCurrentAscending ? 'desc' : 'asc')
    setPage(0)
  }

  return (
    <Box className="review-page">
      <Box className="review-heading">
        <Box>
          <Typography component="h1" variant="h3">Hieroglyph database</Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            A readable view of every sign available in Inpu. Select any column heading to sort it.
          </Typography>
        </Box>
        <Button component={Link} to="/" variant="outlined">Back to input</Button>
      </Box>

      {!isDatabaseReady ? (
        <Box className="review-loading">
          <CircularProgress />
          <Typography>Loading hieroglyphs…</Typography>
        </Box>
      ) : (
        <Paper elevation={3}>
          <Box className="review-summary">
            <Typography variant="h6">{rows.length.toLocaleString()} signs</Typography>
            <Typography color="text.secondary">Sorted by {columns.find(({ key }) => key === sortKey)?.label.toLowerCase()}</Typography>
          </Box>
          <TableContainer className="review-table-container">
            <Table stickyHeader aria-label="Hieroglyph database">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell key={column.key} sortDirection={sortKey === column.key ? sortDirection : false} sx={{ minWidth: column.minWidth }}>
                      <TableSortLabel
                        active={sortKey === column.key}
                        direction={sortKey === column.key ? sortDirection : 'asc'}
                        onClick={() => sortBy(column.key)}
                      >
                        {column.label}
                      </TableSortLabel>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {visibleRows.map((row) => (
                  <TableRow hover key={row.id}>
                    {columns.map((column) => (
                      <TableCell key={column.key}>
                        {column.key === 'glyph' ? (
                          <span className="review-glyph">{row.glyph}</span>
                        ) : column.key === 'category' ? (
                          <Chip label={row.category} size="small" variant="outlined" />
                        ) : (
                          row[column.key] || '—'
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={rows.length}
            page={page}
            onPageChange={(_, nextPage) => setPage(nextPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(Number(event.target.value))
              setPage(0)
            }}
            rowsPerPageOptions={[10, 25, 50, 100]}
          />
        </Paper>
      )}
    </Box>
  )
}
