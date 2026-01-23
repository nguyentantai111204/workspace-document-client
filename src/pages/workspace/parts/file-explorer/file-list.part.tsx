import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, useTheme, TablePagination } from '@mui/material'
import { FileResponse } from '../../../../apis/file/file.interface'
import { FileRow } from './file-row.item'
import { CheckboxComponent } from '../../../../components/checkbox/checkbox.component'

interface FileListProps {
    files: FileResponse[]
    selectedItem: FileResponse | null
    onSelect: (file: FileResponse) => void
    selectedIds: string[]
    onToggleCheck: (id: string) => void
    onCheckAll: (checked: boolean, ids: string[]) => void
    page: number
    rowsPerPage: number
    onPageChange: (event: unknown, newPage: number) => void
    onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export const FileList = ({
    files,
    selectedItem,
    onSelect,
    selectedIds,
    onToggleCheck,
    onCheckAll,
    page,
    rowsPerPage,
    onPageChange,
    onRowsPerPageChange
}: FileListProps) => {
    const theme = useTheme()

    const paginatedFiles = files.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
    )

    const pageIds = paginatedFiles.map(f => f.id)
    const isAllSelected = pageIds.length > 0 && pageIds.every(id => selectedIds.includes(id))
    const isIndeterminate = pageIds.some(id => selectedIds.includes(id)) && !isAllSelected

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
            }}
        >
            <TableContainer sx={{ flex: 1 }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox" sx={{ bgcolor: 'background.paper' }}>
                                <CheckboxComponent
                                    checked={isAllSelected}
                                    indeterminate={isIndeterminate}
                                    onChange={(e) => onCheckAll(e.target.checked, pageIds)}
                                    sizeUI="sm"
                                    shape="square" // Explicitly square for header if prefer
                                />
                            </TableCell>
                            <TableCell sx={{ fontWeight: 600, color: 'text.secondary', fontSize: 13, bgcolor: 'background.paper' }}>TÊN FILE</TableCell>
                            <TableCell sx={{ fontWeight: 600, color: 'text.secondary', fontSize: 13, bgcolor: 'background.paper' }}>KÍCH THƯỚC</TableCell>
                            <TableCell sx={{ fontWeight: 600, color: 'text.secondary', fontSize: 13, bgcolor: 'background.paper' }}>NGÀY TẠO</TableCell>
                            <TableCell sx={{ bgcolor: 'background.paper' }} />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedFiles.map((file) => (
                            <FileRow
                                key={file.id}
                                file={file}
                                selected={selectedItem?.id === file.id || selectedIds.includes(file.id)}
                                onSelect={() => onToggleCheck(file.id)} // Checkbox click behavior
                            />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={files.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={onPageChange}
                onRowsPerPageChange={onRowsPerPageChange}
                sx={{
                    borderTop: `1px solid ${theme.palette.divider}`,
                }}
            />
        </Paper>
    )
}
