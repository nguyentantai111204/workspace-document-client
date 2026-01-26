import { Box, Drawer, useTheme, useMediaQuery, CircularProgress, Typography, Pagination, Zoom, Fab, Tooltip } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { useState } from 'react'
import { ExplorerToolbar } from './file-tools/explorer-toolbar.part'
import { ExplorerFilters } from './file-tools/explorer-filter.part'
import { FileGrid } from './file-view/file-grid.part'
import { FileList } from './file-view/file-list.part'
import { FileDetailSidebar } from './file-view/file-detail.part'
import { UploadFileModal } from '../modals/upload-file.modal'
import { useWorkspace } from '../../../contexts/workspace.context'
import { FileResponse } from '../../../apis/file/file.interface'
import { useDebounce } from '../../../hooks/useDebounce'
import { useFiles } from '../../../hooks/useFiles'
import { PAGE_LIMIT_DEFAULT } from '../../../common/constant/page-take.constant'


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
    const [filters, setFilters] = useState<Partial<ExplorerFilters>>({})
    const [openUploadModal, setOpenUploadModal] = useState(false)
    const debouncedSearch = useDebounce(searchQuery, 500)

    const getFileTypesParams = () => {
        if (!filters.fileTypes) return undefined

        const types = []
        if (filters.fileTypes.folder) types.push('folder')
        if (filters.fileTypes.image) types.push('image')
        if (filters.fileTypes.document) types.push('document')

        return types.length > 0 ? types.join(',') : undefined
    }

    const { files, meta, isLoading, mutate } = useFiles(currentWorkspace?.id, {
        page: page,
        limit: PAGE_LIMIT_DEFAULT.limit,
        search: debouncedSearch || undefined,
        sortOrder: filters.dateSort === 'oldest' ? 'ASC' : 'DESC',
        sortBy: 'createdAt',
        type: getFileTypesParams()
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
                    isDisableListView={isMobile}
                    viewMode={viewMode}
                    workspaceName={currentWorkspace?.name}
                    currentFilters={filters}
                    onViewChange={setViewMode}
                    onSearch={handleSearch}
                    onFilter={(newFilters) => {
                        setFilters(newFilters)
                        setPage(1)
                    }}
                    onUpload={() => setOpenUploadModal(true)}
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

            {isMobile && (
                <Zoom in={true} unmountOnExit>
                    <Fab
                        color="primary"
                        aria-label="add"
                        sx={{
                            position: 'fixed',
                            bottom: 200,
                            right: 10,
                            boxShadow: theme.shadows[4],
                            zIndex: theme.zIndex.speedDial
                        }}
                        onClick={() => setOpenUploadModal(true)}
                    >
                        <Tooltip title="Thêm file">
                            <AddIcon />
                        </Tooltip>
                    </Fab>
                </Zoom>
            )}

            <UploadFileModal
                open={openUploadModal}
                onClose={() => setOpenUploadModal(false)}
                onSuccess={() => {
                    mutate()
                    setPage(1)
                }}
            />
        </Box>
    )
}
