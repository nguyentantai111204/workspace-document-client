import { Box, Typography, Paper, useTheme } from '@mui/material'
import { FileResponse } from '../../../../apis/file/file.interface'
import { getFileIcon } from './file-icon.util'
import { formatDate } from './explorer.constant'

interface FileCardProps {
    file: FileResponse
    selected?: boolean
    onSelect?: (file: FileResponse) => void
}

export const FileCard = ({ file, selected, onSelect }: FileCardProps) => {
    const theme = useTheme()

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
                '&:hover': {
                    borderColor: 'primary.main',
                    boxShadow: theme.shadows[2],
                }
            }}
        >
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
        </Paper>
    )
}
