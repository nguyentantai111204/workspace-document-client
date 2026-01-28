import { Box, Typography, Paper, useTheme, IconButton } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { useState } from 'react'
import { FileActionMenu } from '../file-tools/file-action-menu.part'
import { FileResponse } from '../../../../apis/file/file.interface'
import { formatDateFile } from '../../../../common/utils/file.utils'
import { getFileIcon } from '../../utils/file-icon.util'

interface FileCardProps {
    file: FileResponse
    selected?: boolean
    onSelect?: (file: FileResponse) => void
    onEdit?: (file: FileResponse) => void
    onDelete?: (file: FileResponse) => void
}

export const FileCard = ({ file, selected, onSelect, onEdit, onDelete }: FileCardProps) => {
    const theme = useTheme()
    const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null)

    const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation()
        setMenuAnchorEl(event.currentTarget)
    }

    const handleCloseMenu = () => {
        setMenuAnchorEl(null)
    }

    return (
        <Paper
            elevation={0}
            onClick={() => onSelect?.(file)}
            sx={{
                p: { xs: 1.5, md: 2 },
                height: '100%',
                cursor: 'pointer',
                borderRadius: 3,
                border: selected ? '2px solid' : '1px solid',
                borderColor: selected ? 'primary.main' : 'divider',
                bgcolor: theme.palette.background.paper,
                transition: theme.transitions.create(['border-color', 'box-shadow']),
                position: 'relative',
                '&:hover': {
                    borderColor: 'primary.main',
                    boxShadow: theme.shadows[2],
                    '& .more-btn': {
                        opacity: 1,
                    }
                },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <IconButton
                className="more-btn"
                size="small"
                onClick={handleOpenMenu}
                sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    opacity: menuAnchorEl ? 1 : 0,
                    transition: 'opacity 0.2s',
                    bgcolor: 'background.paper',
                    '&:hover': {
                        bgcolor: 'action.hover',
                    }
                }}
            >
                <MoreVertIcon fontSize="small" />
            </IconButton>

            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    mb: 2,
                    mt: 1
                }}
            >
                {getFileIcon(file.mimeType, { sx: { fontSize: 48 } })}
            </Box>

            <Typography
                variant="subtitle2"
                noWrap
                align="center"
                sx={{
                    mb: 0.5,
                    fontWeight: 600
                }}
                maxWidth={{ xs: '200px', lg: '100%', md: '100%', sm: '100%' }}
            >
                {file.name}
            </Typography>

            <Typography
                variant="caption"
                display="block"
                align="center"
                color="text.secondary"
            >
                {formatDateFile(file.createdAt)}
            </Typography>

            <FileActionMenu
                anchorEl={menuAnchorEl}
                onClose={handleCloseMenu}
                onEdit={() => onEdit?.(file)}
                onDelete={() => onDelete?.(file)}
                onPin={() => console.log('Pin', file.name)}
                onShare={() => console.log('Share', file.name)}
            />
        </Paper>
    )
}
