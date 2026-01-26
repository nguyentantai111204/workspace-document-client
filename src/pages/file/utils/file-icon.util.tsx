import FolderIcon from '@mui/icons-material/Folder'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import ImageIcon from '@mui/icons-material/Image'
import DescriptionIcon from '@mui/icons-material/Description'
import TableChartIcon from '@mui/icons-material/TableChart'
import { SvgIconProps } from '@mui/material'

export const getFileIcon = (mimeType: string, props?: SvgIconProps) => {
    const iconProps = { ...props }

    if (mimeType === 'folder') {
        return <FolderIcon {...iconProps} sx={{ color: '#42A5F5', ...iconProps.sx }} />
    }

    if (mimeType.includes('pdf')) {
        return <PictureAsPdfIcon {...iconProps} sx={{ color: '#F44336', ...iconProps.sx }} />
    }

    if (mimeType.includes('image')) {
        return <ImageIcon {...iconProps} sx={{ color: '#AB47BC', ...iconProps.sx }} />
    }

    if (mimeType.includes('sheet') || mimeType.includes('excel')) {
        return <TableChartIcon {...iconProps} sx={{ color: '#4CAF50', ...iconProps.sx }} />
    }

    if (mimeType.includes('word') || mimeType.includes('document')) {
        return <DescriptionIcon {...iconProps} sx={{ color: '#2196F3', ...iconProps.sx }} />
    }

    return <InsertDriveFileIcon {...iconProps} sx={{ color: '#90A4AE', ...iconProps.sx }} />
}
