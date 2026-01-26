import { Box, Typography, useTheme, alpha } from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { ReactNode } from 'react'

interface TextFieldUploadProps {
    icon?: ReactNode
    title?: string
    subTitle?: string
    orientation?: 'vertical' | 'horizontal'
    isDashed?: boolean
    onDrop?: (files: File[]) => void
    onClick?: () => void
}

export const TextFieldUploadComponent = ({
    icon,
    title = 'Chọn tệp hoặc kéo thả vào đây',
    subTitle = 'PDF, Excel, Images (Max 25MB)',
    orientation = 'vertical',
    isDashed = true,
    onClick,
    onDrop,
}: TextFieldUploadProps) => {
    const theme = useTheme()

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            onDrop?.(Array.from(e.dataTransfer.files))
        }
    }

    return (
        <Box
            onClick={onClick}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            sx={{
                width: '100%',
                display: 'flex',
                cursor: 'pointer',
                flexDirection: orientation === 'vertical' ? 'column' : 'row',
                alignItems: 'center',
                justifyContent: 'center',
                p: 4,
                borderWidth: isDashed ? 2 : 1,
                borderStyle: isDashed ? 'dashed' : 'solid',
                borderColor: 'divider',
                borderRadius: 2,
                bgcolor: alpha(theme.palette.primary.main, 0.02),
                transition: 'all 0.2s',
                gap: 2,
                '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                    borderColor: 'primary.main',
                }
            }}
        >
            <Box
                sx={{
                    p: 2,
                    borderRadius: '50%',
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: 'primary.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                {icon || <CloudUploadIcon sx={{ fontSize: 32 }} />}
            </Box>

            <Box sx={{ textAlign: orientation === 'vertical' ? 'center' : 'left' }}>
                <Typography variant="subtitle1" fontWeight={600} color="text.primary">
                    <Typography component="span" color="primary.main" fontWeight={700}>
                        {title.split(' ')[0]}
                    </Typography>
                    {' ' + title.substring(title.indexOf(' ') + 1)}
                </Typography>

                {subTitle && (
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                        {subTitle}
                    </Typography>
                )}
            </Box>
        </Box>
    )
}
