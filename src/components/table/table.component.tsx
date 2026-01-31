import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box,
    Typography,
    useTheme,
    alpha
} from '@mui/material'
import { CheckboxComponent } from '../checkbox/checkbox.component'
import { TableColumn, TableProps } from './table.interface'

export function TableComponent<T extends { id: string }>({
    data,
    columns,
    selection
}: TableProps<T>) {
    const theme = useTheme()

    const isAllSelected = data.length > 0 && selection && data.every((row: T) => selection.selectedIds.includes(row.id))
    const isIndeterminate = selection && data.some((row: T) => selection.selectedIds.includes(row.id)) && !isAllSelected

    return (
        <Paper
            elevation={0}
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
                overflow: 'hidden',
                bgcolor: theme.palette.background.paper,
                backgroundImage: 'none',
                transition: theme.transitions.create(['background-color', 'border-color']),
            }}
        >
            <TableContainer sx={{ flex: 1, minHeight: 400 }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            {selection && (
                                <TableCell
                                    padding="checkbox"
                                    sx={{ bgcolor: 'background.paper', transition: theme.transitions.create('background-color') }}
                                >
                                    <Box display="flex" justifyContent="center">
                                        <CheckboxComponent
                                            checked={!!isAllSelected}
                                            indeterminate={!!isIndeterminate}
                                            onChange={(e) => selection.onSelectAll(e.target.checked, data.map((d: T) => d.id))}
                                            sizeUI="sm"
                                            shape="square"
                                            disabled={data.length === 0}
                                        />
                                    </Box>
                                </TableCell>
                            )}
                            {columns.map((column: TableColumn<T>) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align || 'left'}
                                    sx={{
                                        fontWeight: 600,
                                        color: 'text.secondary',
                                        fontSize: 13,
                                        bgcolor: 'background.paper',
                                        width: column.width,
                                        minWidth: column.minWidth
                                    }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length + (selection ? 1 : 0)}
                                    sx={{
                                        textAlign: 'center',
                                        py: 8,
                                        color: 'text.secondary',
                                        borderBottom: 'none'
                                    }}
                                >
                                    <Typography variant="body2">
                                        Không có dữ liệu
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((row: T) => {
                                const isSelected = selection?.selectedIds.includes(row.id)
                                return (
                                    <TableRow
                                        key={row.id}
                                        hover
                                        onClick={() => selection?.onRowClick?.(row)}
                                        sx={{
                                            cursor: selection?.onRowClick ? 'pointer' : 'default',
                                            bgcolor: isSelected
                                                ? alpha(theme.palette.primary.main, 0.04)
                                                : 'transparent',
                                            '&:hover': {
                                                bgcolor: alpha(theme.palette.primary.main, 0.02),
                                            },
                                            '& td': {
                                                borderBottom: `1px solid ${theme.palette.divider}`,
                                            }
                                        }}
                                    >
                                        {selection && (
                                            <TableCell padding="checkbox">
                                                <Box
                                                    display="flex"
                                                    justifyContent="center"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <CheckboxComponent
                                                        checked={!!isSelected}
                                                        onChange={() => selection.onSelect(row.id)}
                                                        sizeUI="sm"
                                                    />
                                                </Box>
                                            </TableCell>
                                        )}
                                        {columns.map((column: TableColumn<T>) => (
                                            <TableCell key={column.id} align={column.align || 'left'}>
                                                {column.render ? column.render(row) : (row as any)[column.id]}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                )
                            })
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    )
}
