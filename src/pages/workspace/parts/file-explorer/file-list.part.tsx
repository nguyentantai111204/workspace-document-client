import { Box, Typography, IconButton } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { FileResponse } from '../../../../apis/file/file.interface'
import { TableComponent } from '../../../../components/table/table.component'
import { TableColumn } from '../../../../components/table/table.interface'
import { getFileIcon } from './file-icon.util'
import { FileActionMenu } from './file-action-menu.part'
import React, { useState } from 'react'
import { formatDateFile, formatFileSize } from '../../../../common/utils/file.utils'

interface FileListProps {
    files: FileResponse[]
    onSelect: (file: FileResponse) => void
    selectedIds: string[]
    onToggleCheck: (id: string) => void
    onCheckAll: (checked: boolean, ids: string[]) => void
}

const FileActionCell = ({ file }: { file: FileResponse }) => {
    const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null)

    const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation()
        setMenuAnchorEl(event.currentTarget)
    }

    const handleCloseMenu = () => {
        setMenuAnchorEl(null)
    }

    return (
        <React.Fragment>
            <IconButton size="small" onClick={handleOpenMenu}>
                <MoreVertIcon fontSize="small" />
            </IconButton>
            <FileActionMenu
                anchorEl={menuAnchorEl}
                onClose={handleCloseMenu}
                onEdit={() => console.log('Edit', file.name)}
                onDelete={() => console.log('Delete', file.name)}
                onPin={() => console.log('Pin', file.name)}
                onShare={() => console.log('Share', file.name)}
            />
        </React.Fragment>
    )
}

export const FileList = ({
    files,
    onSelect,
    selectedIds,
    onToggleCheck,
    onCheckAll,
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
            render: (file) => <FileActionCell file={file} />
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

