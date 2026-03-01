import { Box, Drawer, useTheme, useMediaQuery, CircularProgress, Typography, Zoom, Fab, Tooltip } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { useState } from 'react'
import { ExplorerToolbar } from './file-tools/explorer-toolbar.part'
import { ExplorerFilters } from './file-tools/explorer-filter.part'
import { FileGrid } from './file-view/file-grid.part'
import { FileList } from './file-view/file-list.part'
import { FileDetailSidebar } from './file-view/file-detail.part'
import { UploadFileModal } from '../components/upload-file.component'
import { UpdateFileModal } from '../components/update-file.component'
import { useWorkspace } from '../../../contexts/workspace.context'
import { FileResponse } from '../../../apis/file/file.interface'
import { useDebounce } from '../../../hooks/use-debounce.hook'
import { useFiles } from '../../../hooks/use-file.hook'
import { PAGE_LIMIT_DEFAULT } from '../../../common/constant/page-take.constant'
import { StackColumn, StackRow } from '../../../components/mui-custom/stack/stack.mui-custom'
import { usePagination } from '../../../hooks/use-pagination.hook'
import { PaginationComponent } from '../../../components/pagination/pagination.component'
import { getFilePermissions } from '../utils/file-permissions.util'


export const FileExplorerComponent = () => {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg'))
    const { currentWorkspace, currentMember } = useWorkspace()
    const permissions = getFilePermissions(currentMember?.role)

    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [selectedItem, setSelectedItem] = useState<FileResponse | null>(null)
    const [selectedIds, setSelectedIds] = useState<string[]>([])
    const [searchQuery, setSearchQuery] = useState('')
    const [filters, setFilters] = useState<Partial<ExplorerFilters>>({})
    const [openUploadModal, setOpenUploadModal] = useState(false)
    const [openRenameModal, setOpenRenameModal] = useState(false)
    const debouncedSearch = useDebounce(searchQuery, 500)

    const { page, setPage, resetPage } = usePagination()

    const getFileTypesParams = () => {
        if (!filters.fileTypes) return undefined

        const types = []
        if (filters.fileTypes.folder) types.push('folder')
        if (filters.fileTypes.image) types.push('image')
        if (filters.fileTypes.document) types.push('document')

        return types.length > 0 ? types.join(',') : undefined
    }

    const { files, meta, isLoading, mutate, updateFile, deleteFile } = useFiles(currentWorkspace?.id, {
        page: page,
        limit: PAGE_LIMIT_DEFAULT.limit,
        search: debouncedSearch || undefined,
        sortOrder: filters.dateSort === 'oldest' ? 'ASC' : 'DESC',
        sortBy: 'createdAt',
        type: getFileTypesParams(),
    })

    const { paginationProps } = usePagination({ totalPages: meta?.totalPages })

    const handleRenameSubmit = async (newName: string) => {
        if (!selectedItem) return
        try {
            await updateFile(selectedItem.id, { name: newName })
            setSelectedItem(prev => prev ? { ...prev, name: newName } : null)
        } catch (error) {
            console.error(error)
        }
    }

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
        resetPage()
    }

    const handleDeleteFile = async (id: string) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa file này không?')) return
        try {
            await deleteFile(id)
            setSelectedItem(null)
        } catch (error) {
            console.error(error)
        }
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
                <StackColumn sx={{ justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <Typography color="text.secondary">Chưa có dữ liệu</Typography>
                </StackColumn>
            )
        }

        if (responsiveViewMode === 'grid') {
            return (
                <Box sx={{ flex: 1, overflowY: 'auto', ...scrollbarStyle, pr: 1 }}>
                    <FileGrid
                        files={files}
                        selectedItem={selectedItem}
                        permissions={permissions}
                        onSelect={handleSelect}
                        onEdit={(file) => {
                            setSelectedItem(file)
                            setOpenRenameModal(true)
                        }}
                        onDelete={(file) => handleDeleteFile(file.id)}
                    />
                </Box>
            )
        }

        return (
            <FileList
                files={files}
                permissions={permissions}
                onSelect={handleSelect}
                selectedIds={selectedIds}
                onToggleCheck={handleToggleCheck}
                onCheckAll={handleCheckAll}
                onEdit={(file) => {
                    setSelectedItem(file)
                    setOpenRenameModal(true)
                }}
                onDelete={(file) => handleDeleteFile(file.id)}
            />
        )
    }


    return (
        <StackRow sx={{ height: '100%', overflow: 'hidden' }}>
            <StackColumn
                sx={{
                    flex: 1,
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
                        resetPage()
                    }}
                    onUpload={() => setOpenUploadModal(true)}
                />

                <StackColumn sx={{ flex: 1, overflow: 'hidden' }}>
                    {renderContent()}
                </StackColumn>

                {paginationProps && (
                    <PaginationComponent {...paginationProps} />
                )}
            </StackColumn>

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
                    resetPage()
                }}
            />

            {selectedItem && (
                <UpdateFileModal
                    open={openRenameModal}
                    fileName={selectedItem.name}
                    onClose={() => setOpenRenameModal(false)}
                    onSubmit={handleRenameSubmit}
                />
            )}
        </StackRow>
    )
}
