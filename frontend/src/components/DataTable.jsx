import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

/**
 * Reusable DataTable component built on top of MUI Table.
 *
 * Props:
 *  - columns: Array<{ id: string, label: string, align?: 'left'|'right'|'center', width?: number|string, minWidth?: number, format?: (value:any, row:object)=>React.ReactNode }>
 *  - rows: Array<object>
 *  - getRowId?: (row, index) => string | number (default: row.id || index)
 *  - loading?: boolean (default false)
 *  - emptyMessage?: string (default 'No data')
 *  - dense?: boolean (smaller row height)
 *  - hover?: boolean (row hover highlight)
 *  - striped?: boolean (alternate row background)
 *  - stickyHeader?: boolean (use sticky header)
 *  - maxHeight?: number|string (applies scroll container)
 *  - minWidth?: number (default 650)
 *  - onRowClick?: (row) => void
 *  - sx?: additional sx styling object for container
 *
 * Example usage:
 * const columns = [
 *   { id: 'name', label: 'Dessert' },
 *   { id: 'calories', label: 'Calories', align: 'right' },
 *   { id: 'fat', label: 'Fat (g)', align: 'right', format: v => v.toFixed(1) },
 * ];
 * const rows = [{ id: 1, name: 'Frozen yoghurt', calories: 159, fat: 6.0 }];
 * <DataTable columns={columns} rows={rows} striped dense onRowClick={r => console.log(r)}/>;
 */
export default function DataTable({
  columns = [],
  rows = [],
  getRowId,
  loading = false,
  emptyMessage = 'No data',
  dense = false,
  hover = true,
  striped = false,
  stickyHeader = false,
  maxHeight,
  minWidth = 650,
  onRowClick,
  sx,
}) {
  const resolveRowId = getRowId || ((row, idx) => (row && row.id != null ? row.id : idx));

  return (
    <TableContainer
      component={Paper}
      sx={{
        maxHeight: maxHeight || undefined,
        ...(striped && {
          '& tbody tr:nth-of-type(odd)': {
            backgroundColor: theme => theme.palette.action.hover,
          },
        }),
        ...sx,
      }}
    >
      <Table
        stickyHeader={stickyHeader}
        size={dense ? 'small' : 'medium'}
        sx={{ minWidth }}
        aria-label="data table"
      >
        <TableHead>
          <TableRow>
            {columns.map(col => (
              <TableCell
                key={col.id}
                align={col.align || 'left'}
                sx={{
                  width: col.width,
                  minWidth: col.minWidth,
                  fontWeight: 600,
                  backgroundColor: stickyHeader ? (theme => theme.palette.background.paper) : undefined,
                }}
              >
                {col.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {loading && (
            <TableRow>
              <TableCell colSpan={columns.length} align="center" sx={{ py: 6 }}>
                <CircularProgress size={32} />
              </TableCell>
            </TableRow>
          )}
          {!loading && rows.length === 0 && (
            <TableRow>
              <TableCell colSpan={columns.length} align="center" sx={{ py: 4 }}>
                <Typography variant="body2" color="text.secondary">{emptyMessage}</Typography>
              </TableCell>
            </TableRow>
          )}
          {!loading && rows.map((row, idx) => {
            const rowId = resolveRowId(row, idx);
            return (
              <TableRow
                hover={hover}
                key={rowId}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                sx={{
                  cursor: onRowClick ? 'pointer' : 'default',
                  '&:last-child td, &:last-child th': { border: 0 },
                }}
              >
                {columns.map(col => {
                  let value = row[col.id];
                  if (col.format && value !== undefined && value !== null) {
                    value = col.format(value, row);
                  }
                  return (
                    <TableCell key={`${rowId}-${col.id}`} align={col.align || 'left'}>
                      {value ?? ''}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
