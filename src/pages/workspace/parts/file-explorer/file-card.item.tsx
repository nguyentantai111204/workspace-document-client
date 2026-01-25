import { Box, Typography, Paper, useTheme, IconButton } from '@mui/material'
import { FileResponse } from '../../../../apis/file/file.interface'
import { getFileIcon } from './file-icon.util'
import { formatDate } from './explorer.constant'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { useState } from 'react'
import { FileActionMenu } from './file-action-menu.part'

interface FileCardProps {
    file: FileResponse
    selected?: boolean
    onSelect?: (file: FileResponse) => void
}

export const FileCard = ({ file, selected, onSelect }: FileCardProps) => {
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
                p: 2,
                height: '100%',
                cursor: 'pointer',
                borderRadius: 3,
                border: selected ? '2px solid' : '1px solid',
                borderColor: selected ? 'primary.main' : 'divider',
                bgcolor: theme.palette.background.paper,
                backgroundImage: 'none',
                transition: theme.transitions.create(['border-color', 'box-shadow']),
                position: 'relative',
                '&:hover': {
                    borderColor: 'primary.main',
                    boxShadow: theme.shadows[2],
                    '& .more-btn': {
                        opacity: 1,
                    }
                }
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
            >
                {file.name}
            </Typography>

            <Typography
                variant="caption"
                display="block"
                align="center"
                color="text.secondary"
            >
                {formatDate(file.createdAt)}
            </Typography>

            <FileActionMenu
                anchorEl={menuAnchorEl}
                onClose={handleCloseMenu}
                onEdit={() => console.log('Edit', file.name)}
                onDelete={() => console.log('Delete', file.name)}
                onPin={() => console.log('Pin', file.name)}
                onShare={() => console.log('Share', file.name)}
            />
        </Paper>
    )
}
