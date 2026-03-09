import { Box, Typography, useTheme, alpha } from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { ReactNode, useRef } from 'react'
import { StackRowAlignCenterJustCenter } from '../mui-custom/stack/stack.mui-custom'

interface TextFieldUploadProps {
    icon?: ReactNode
    title?: string
    subTitle?: string
    orientation?: 'vertical' | 'horizontal'
    isDashed?: boolean
    accept?: string
    multiple?: boolean
    onChange?: (files: File[]) => void
    onDrop?: (files: File[]) => void
    onClick?: () => void
}

export const TextFieldUploadComponent = ({
    icon,
    title = 'Chọn tệp hoặc kéo thả vào đây',
    subTitle = 'PDF, Excel, Images (Max 25MB)',
    orientation = 'vertical',
    isDashed = true,
    accept,
    multiple,
    onChange,
    onClick,
    onDrop,
}: TextFieldUploadProps) => {
    const theme = useTheme()
    const inputRef = useRef<HTMLInputElement>(null)

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const files = Array.from(e.dataTransfer.files)
            onChange?.(files)
            onDrop?.(files)
        }
    }

    const handleClick = () => {
        onClick?.()
        inputRef.current?.click()
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            onChange?.(Array.from(e.target.files))
        }
        if (inputRef.current) {
            inputRef.current.value = ''
        }
    }

    return (
        <>
            <input
                type="file"
                ref={inputRef}
                style={{ display: 'none' }}
                accept={accept}
                multiple={multiple}
                onChange={handleInputChange}
            />
            <Box
                onClick={handleClick}
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
                <StackRowAlignCenterJustCenter
                    sx={{
                        p: 2,
                        borderRadius: '50%',
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: 'primary.main',
                    }}
                >
                    {icon || <CloudUploadIcon sx={{ fontSize: 32 }} />}
                </StackRowAlignCenterJustCenter>

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
        </>
    )
}
