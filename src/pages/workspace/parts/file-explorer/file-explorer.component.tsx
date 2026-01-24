import { Box, Drawer, useTheme, useMediaQuery } from '@mui/material'
import { useState } from 'react'
import { FileResponse } from '../../../../apis/file/file.interface'
import { MOCK_FILES } from './explorer.constant'
import { ExplorerToolbar } from './explorer-toolbar.part'
import { FileGrid } from './file-grid.part'
import { FileList } from './file-list.part'
import { FileDetailSidebar } from './file-detail.part'
import { PAGE_TAKE_DEFAULT } from '../../../../common/constant/page-take.constant'

export const FileExplorerComponent = () => {
    const theme = useTheme()
    const isMobile = useMediaQuery('(max-width: 500px)')
    const isTablet = useMediaQuery('(min-width: 501px) and (max-width: 899px)')
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [selectedItem, setSelectedItem] = useState<FileResponse | null>(null)
    const [selectedIds, setSelectedIds] = useState<string[]>([])
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(PAGE_TAKE_DEFAULT.take)

    const scrollbarStyle = {
        '&::-webkit-scrollbar': {
            width: '6px',
            height: '6px',
        },
        '&::-webkit-scrollbar-track': {
            backgroundColor: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: theme.palette.divider,
            borderRadius: '3px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: theme.palette.text.secondary,
        },
    }

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
            const newIds = ids.filter(id => !selectedIds.includes(id))
            setSelectedIds(prev => [...prev, ...newIds])
        } else {
            setSelectedIds(prev => prev.filter(id => !ids.includes(id)))
        }
    }

    const detailContent = selectedItem && (
        <FileDetailSidebar
            file={selectedItem}
            onClose={handleCloseDetail}
        />
    )

    return (
        <Box sx={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    p: { xs: 2, md: 3 }
                }}
            >
                <ExplorerToolbar
                    isDisableListView={isMobile}
                    viewMode={viewMode}
                    onViewChange={setViewMode}
                />

                <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    {viewMode === 'grid' ? (
                        <Box sx={{ flex: 1, overflowY: 'auto', ...scrollbarStyle, pr: 1 }}>
                            <FileGrid
                                files={MOCK_FILES}
                                selectedItem={selectedItem}
                                onSelect={handleSelect}
                            />
                        </Box>
                    ) : (
                        <FileList
                            files={MOCK_FILES}
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

            {/* Mobile*/}
            <Drawer
                anchor="bottom"
                open={isMobile && Boolean(selectedItem)}
                onClose={handleCloseDetail}
                ModalProps={{ keepMounted: true }}
                PaperProps={{
                    sx: { height: '85vh', borderTopLeftRadius: 16, borderTopRightRadius: 16 }
                }}
            >
                {detailContent}
            </Drawer>

            {/* Tablet */}
            <Drawer
                anchor="right"
                open={isTablet && Boolean(selectedItem)}
                onClose={handleCloseDetail}
                ModalProps={{ keepMounted: true }}
                PaperProps={{
                    sx: { width: 350, borderTopLeftRadius: 16, borderBottomLeftRadius: 16 }
                }}
            >
                {detailContent}
            </Drawer>

            {/* Desktop Sidebar */}
            {!isMobile && !isTablet && selectedItem && detailContent}
        </Box>
    )
}
