import { Box, Typography, IconButton } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { getFileIcon } from '../../utils/file-icon.util'
import { FileActionMenu } from '../file-tools/file-action-menu.part'
import React, { useState } from 'react'
import { FileResponse } from '../../../../apis/file/file.interface'
import { TableColumn } from '../../../../components/table/table.interface'
import { formatDateFile, formatFileSize } from '../../../../common/utils/file.utils'
import { TableComponent } from '../../../../components/table/table.component'
import { FilePermissions } from '../../utils/file-permissions.util'

interface FileListProps {
    files: FileResponse[]
    permissions: FilePermissions
    onSelect: (file: FileResponse) => void
    selectedIds: string[]
    onToggleCheck: (id: string) => void
    onCheckAll: (checked: boolean, ids: string[]) => void
    onEdit: (file: FileResponse) => void
    onDelete: (file: FileResponse) => void
}

const FileActionCell = ({
    file,
    permissions,
    onEdit,
    onDelete
}: {
    file: FileResponse,
    permissions: FilePermissions,
    onEdit: (file: FileResponse) => void
    onDelete: (file: FileResponse) => void
}) => {
    const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null)

    const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation()
        setMenuAnchorEl(event.currentTarget)
    }

    const handleCloseMenu = () => {
        setMenuAnchorEl(null)
    }

    const hasAnyAction = permissions.canEdit || permissions.canDelete || permissions.canShare
    if (!hasAnyAction) return null

    return (
        <React.Fragment>
            <IconButton size="small" onClick={handleOpenMenu}>
                <MoreVertIcon fontSize="small" />
            </IconButton>
            <FileActionMenu
                anchorEl={menuAnchorEl}
                onClose={handleCloseMenu}
                permissions={permissions}
                onEdit={() => onEdit(file)}
                onDelete={() => onDelete(file)}
                onShare={() => console.log('Share', file.name)}
            />
        </React.Fragment>
    )
}

export const FileList = ({
    files,
    permissions,
    onSelect,
    selectedIds,
    onToggleCheck,
    onCheckAll,
    onEdit,
    onDelete
}: FileListProps) => {

    const columns: TableColumn<FileResponse>[] = [
        {
            id: 'name',
            label: 'TÊN FILE',
            render: (file) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 0 }}>
                    {getFileIcon(file.mimeType, { sx: { fontSize: 24, flexShrink: 0 } })}
                    <Typography variant="body2" fontWeight={500} noWrap>
                        {file.name}
                    </Typography>
                </Box>
            )
        },
        {
            id: 'size',
            label: 'KÍCH THƯỚC',
            render: (file) => (
                <Typography variant="body2" color="text.secondary">
                    {file.mimeType === 'folder'
                        ? `${file.itemCount || 0} mục`
                        : formatFileSize(file.size)
                    }
                </Typography>
            )
        },
        {
            id: 'createdAt',
            label: 'NGÀY TẠO',
            render: (file) => (
                <Typography variant="body2" color="text.secondary">
                    {formatDateFile(file.createdAt)}
                </Typography>
            )
        },
        {
            id: 'actions',
            label: '',
            align: 'right',
            render: (file) => <FileActionCell file={file} permissions={permissions} onEdit={onEdit} onDelete={onDelete} />
        }
    ]

    return (
        <TableComponent
            data={files}
            columns={columns}
            selection={{
                selectedIds,
                onSelect: onToggleCheck,
                onSelectAll: onCheckAll,
                onRowClick: onSelect
            }}
        />
    )
}
