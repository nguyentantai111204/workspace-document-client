import { Box, Typography, IconButton, TableRow, TableCell, useTheme, alpha } from '@mui/material'
import { CheckboxComponent } from '../../../../components/checkbox/checkbox.component'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { FileResponse } from '../../../../apis/file/file.interface'
import { getFileIcon } from './file-icon.util'
import { formatDate, formatFileSize } from './explorer.constant'

interface FileRowProps {
    file: FileResponse
    selected?: boolean
    onSelect?: (file: FileResponse) => void
}

export const FileRow = ({ file, selected, onSelect }: FileRowProps) => {
    const theme = useTheme()

    return (
        <TableRow
            onClick={() => onSelect?.(file)}
            sx={{
                cursor: 'pointer',
                bgcolor: selected
                    ? alpha(theme.palette.primary.main, 0.04)
                    : 'transparent',
                '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.02),
                },
                '& td': {
                    borderBottom: `1px solid ${theme.palette.divider}`,
                }
            }}
        >
            <TableCell padding="checkbox">
                <Box
                    display="flex"
                    justifyContent="center"
                    onClick={(e) => e.stopPropagation()}
                >
                    <CheckboxComponent
                        checked={selected}
                        onChange={() => onSelect?.(file)}
                        sizeUI="sm"
                    />
                </Box>
            </TableCell>

            <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {getFileIcon(file.mimeType, { sx: { fontSize: 24 } })}
                    <Typography variant="body2" fontWeight={500}>
                        {file.name}
                    </Typography>
                </Box>
            </TableCell>

            <TableCell>
                <Typography variant="body2" color="text.secondary">
                    {file.mimeType === 'folder'
                        ? `${file.itemCount || 0} mục`
                        : formatFileSize(file.size)
                    }
                </Typography>
            </TableCell>

            <TableCell>
                <Typography variant="body2" color="text.secondary">
                    {formatDate(file.createdAt)}
                </Typography>
            </TableCell>

            <TableCell align="right">
                <IconButton size="small">
                    <MoreVertIcon fontSize="small" />
                </IconButton>
            </TableCell>
        </TableRow>
    )
}
