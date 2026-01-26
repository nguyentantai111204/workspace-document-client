import { Box, Drawer, useTheme, useMediaQuery, CircularProgress, Typography, Pagination } from '@mui/material'
import { useState } from 'react'
import { FileResponse } from '../../../../apis/file/file.interface'
import { ExplorerToolbar } from './explorer-toolbar.part'
import { FileGrid } from './file-grid.part'
import { FileList } from './file-list.part'
import { FileDetailSidebar } from './file-detail.part'
import { useWorkspace } from '../../../../contexts/workspace.context'
import { useFiles } from '../../../../hooks/useFiles'
import { useDebounce } from '../../../../hooks/useDebounce'
import { PAGE_LIMIT_DEFAULT } from '../../../../common/constant/page-take.constant'


export const FileExplorerComponent = () => {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg'))
    const { currentWorkspace } = useWorkspace()

    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [selectedItem, setSelectedItem] = useState<FileResponse | null>(null)
    const [selectedIds, setSelectedIds] = useState<string[]>([])
    const [page, setPage] = useState(1)
    const [searchQuery, setSearchQuery] = useState('')
    const [filters, setFilters] = useState<any>({})
    const debouncedSearch = useDebounce(searchQuery, 500)

    const { files, meta, isLoading } = useFiles(currentWorkspace?.id, {
        page: page,
        limit: PAGE_LIMIT_DEFAULT.limit,
        search: debouncedSearch || undefined,
        sortOrder: filters.dateSort === 'oldest' ? 'ASC' : 'DESC',
        // sortBy: 'createdAt',
    })

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

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage)
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

    const handleSearch = (value: string) => {
        setSearchQuery(value)
        setPage(1)
    }

    const detailContent = selectedItem && (
        <FileDetailSidebar
            file={selectedItem}
            onClose={handleCloseDetail}
        />
    )

    const responsiveViewMode = isMobile ? 'grid' : viewMode

    const renderContent = () => {
        if (isLoading) {
            return (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <CircularProgress />
                </Box>
            )
        }

        if (files.length === 0) {
            return (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', flexDirection: 'column' }}>
                    <Typography color="text.secondary">Chưa có dữ liệu</Typography>
                </Box>
            )
        }

        if (responsiveViewMode === 'grid') {
            return (
                <Box sx={{ flex: 1, overflowY: 'auto', ...scrollbarStyle, pr: 1 }}>
                    <FileGrid
                        files={files}
                        selectedItem={selectedItem}
                        onSelect={handleSelect}
                    />
                </Box>
            )
        }

        return (
            <FileList
                files={files}
                onSelect={handleSelect}
                selectedIds={selectedIds}
                onToggleCheck={handleToggleCheck}
                onCheckAll={handleCheckAll}
            />
        )
    }


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
                    isClickedDetail={Boolean(selectedItem)}
                    isDisableListView={isMobile}
                    viewMode={viewMode}
                    workspaceName={currentWorkspace?.name}
                    onViewChange={setViewMode}
                    onSearch={handleSearch}
                    onFilter={(newFilters) => {
                        setFilters(newFilters)
                        setPage(1)
                    }}
                />

                <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    {renderContent()}
                </Box>

                {meta && meta.totalPages > 0 && (
                    <Box sx={{ pt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                        <Pagination
                            count={meta.totalPages}
                            page={page}
                            onChange={handleChangePage}
                            color="primary"
                            shape="rounded"
                            size={isMobile ? 'small' : 'medium'}
                            siblingCount={isMobile ? 0 : 1}
                        />
                    </Box>
                )}
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
