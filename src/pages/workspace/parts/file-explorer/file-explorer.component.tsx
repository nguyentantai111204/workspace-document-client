import { Box } from '@mui/material'
import { useState } from 'react'
import { FileResponse } from '../../../../apis/file/file.interface'
import { MOCK_FILES } from './explorer.constant'
import { ExplorerToolbar } from './explorer-toolbar.part'
import { FileGrid } from './file-grid.part'
import { FileList } from './file-list.part'
import { FileDetailSidebar } from './file-detail.part'

export const FileExplorerComponent = () => {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [selectedItem, setSelectedItem] = useState<FileResponse | null>(null)
    const [selectedIds, setSelectedIds] = useState<string[]>([])
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)

    const handleSelect = (file: FileResponse) => {
        setSelectedItem(file)
    }

    const handleCloseDetail = () => {
        setSelectedItem(null)
    }

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }

    const handleToggleCheck = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id)
                ? prev.filter(itemId => itemId !== id)
                : [...prev, id]
        )
    }

    const handleCheckAll = (checked: boolean, ids: string[]) => {
        if (checked) {
            // Add all ids that are not already selected
            const newIds = ids.filter(id => !selectedIds.includes(id))
            setSelectedIds(prev => [...prev, ...newIds])
        } else {
            // Remove ids from selection
            setSelectedIds(prev => prev.filter(id => !ids.includes(id)))
        }
    }

    return (
        <Box sx={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    p: 3
                }}
            >
                <ExplorerToolbar
                    viewMode={viewMode}
                    onViewChange={setViewMode}
                />

                <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    {viewMode === 'grid' ? (
                        <Box sx={{ flex: 1, overflowY: 'auto' }}>
                            <FileGrid
                                files={MOCK_FILES}
                                selectedItem={selectedItem}
                                onSelect={handleSelect}
                            />
                        </Box>
                    ) : (
                        <FileList
                            files={MOCK_FILES}
                            selectedItem={selectedItem}
                            onSelect={handleSelect}
                            selectedIds={selectedIds}
                            onToggleCheck={handleToggleCheck}
                            onCheckAll={handleCheckAll}
                            page={page}
                            rowsPerPage={rowsPerPage}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    )}
                </Box>
            </Box>

            {selectedItem && (
                <FileDetailSidebar
                    file={selectedItem}
                    onClose={handleCloseDetail}
                />
            )}
        </Box>
    )
}
