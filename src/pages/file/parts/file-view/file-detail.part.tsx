import { Box, Typography, IconButton, Divider, useTheme, alpha, Fade } from '@mui/material'
import { StackRow, StackRowAlignCenter, StackRowAlignCenterJustBetween } from '../../../../components/mui-custom/stack/stack.mui-custom'
import CloseIcon from '@mui/icons-material/Close'
import VisibilityIcon from '@mui/icons-material/Visibility'
import DownloadIcon from '@mui/icons-material/Download'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { getFileIcon } from '../../utils/file-icon.util'
import { FileResponse } from '../../../../apis/file/file.interface'
import { SIDEBAR_WIDTH, TIME_ANIMATION } from '../../../../common/constant/style.constant'
import { formatDateFile, formatFileSize } from '../../../../common/utils/file.utils'
import { ButtonComponent } from '../../../../components/button/button.component'

interface FileDetailSidebarProps {
    file: FileResponse
    onClose: () => void
}

import { FilePreviewDialog } from './file-preview-dialog.part'
import { useState } from 'react'

export const FileDetailSidebar = ({ file, onClose }: FileDetailSidebarProps) => {
    const theme = useTheme()
    const [previewOpen, setPreviewOpen] = useState(false)

    const handleViewFile = () => {
        const supportedPreviewTypes = [
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/pdf',
            'text/plain',
            'text/csv'
        ]

        if (supportedPreviewTypes.includes(file.mimeType) || file.mimeType.startsWith('image/')) {
            setPreviewOpen(true)
        } else {
            const msOfficeTypes = [
                'application/vnd.ms-excel',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'application/vnd.ms-powerpoint',
                'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                'application/msword'
            ]

            if (msOfficeTypes.includes(file.mimeType)) {
                window.open(`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(file.url)}`, '_blank')
            } else {
                handleDownloadFile()
            }
        }
    }

    const handleDownloadFile = async () => {
        try {
            const response = await fetch(file.url)
            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = file.name
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)
        } catch (error) {
            console.error('Download failed:', error)
            window.open(file.url, '_blank')
        }
    }

    return (
        <Fade in={true} timeout={TIME_ANIMATION}>
            <Box
                sx={{
                    width: { xs: '100%', md: 320 },
                    borderLeft: { md: `1px solid ${theme.palette.divider}` },
                    bgcolor: theme.palette.background.paper,
                    backgroundImage: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    transition: theme.transitions.create(['background-color', 'border-color']),
                }}
            >
                <StackRowAlignCenterJustBetween sx={{ p: 2 }}>
                    <StackRowAlignCenter spacing={1}>
                        <InfoOutlinedIcon color="primary" fontSize="small" />
                        <Typography variant="subtitle2" fontWeight={600}>
                            Chi tiết
                        </Typography>
                    </StackRowAlignCenter>
                    <IconButton size="small" onClick={onClose}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </StackRowAlignCenterJustBetween>

                <Divider />

                <Box sx={{ p: 3, flex: 1, overflowY: 'auto' }}>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            mb: 3,
                            p: 4,
                            bgcolor: alpha(theme.palette.primary.main, 0.04),
                            borderRadius: 3
                        }}
                    >
                        {getFileIcon(file.mimeType, { sx: { fontSize: 80 } })}
                    </Box>

                    <Typography variant="subtitle1" fontWeight={600} align="center" gutterBottom sx={{ wordBreak: 'break-all' }}>
                        {file.name}
                    </Typography>
                    <Typography noWrap variant="body2" color="text.secondary" align="center" sx={{ mb: 4, textTransform: 'uppercase', fontSize: 12, letterSpacing: 1, maxWidth: SIDEBAR_WIDTH }}>
                        {file.mimeType === 'folder' ? 'FOLDER' : file.mimeType.split('/')[1]?.toUpperCase() || 'FILE'}
                    </Typography>

                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, fontSize: 13, fontWeight: 600 }}>
                        THÔNG TIN
                    </Typography>

                    <StackRow spacing={2} sx={{ mb: 4, flexDirection: 'column' }}>
                        <StackRowAlignCenterJustBetween>
                            <Typography variant="body2" color="text.secondary">Loại</Typography>
                            <Typography variant="body2" fontWeight={500}>
                                {file.mimeType === 'folder' ? 'Thư mục' : 'File'}
                            </Typography>
                        </StackRowAlignCenterJustBetween>
                        <StackRowAlignCenterJustBetween>
                            <Typography variant="body2" color="text.secondary">Kích thước</Typography>
                            <Typography variant="body2" fontWeight={500}>
                                {file.mimeType === 'folder' ? '-' : formatFileSize(file.size)}
                            </Typography>
                        </StackRowAlignCenterJustBetween>
                        <StackRowAlignCenterJustBetween>
                            <Typography variant="body2" color="text.secondary">Ngày tạo</Typography>
                            <Typography variant="body2" fontWeight={500}>
                                {formatDateFile(file.createdAt)}
                            </Typography>
                        </StackRowAlignCenterJustBetween>
                    </StackRow>
                </Box>

                <Box sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
                    <StackRow spacing={1}>
                        <ButtonComponent
                            variant="secondary"
                            icon={<VisibilityIcon fontSize="small" />}
                            fullWidth
                            onClick={handleViewFile}
                        >
                            Xem
                        </ButtonComponent>
                        <ButtonComponent
                            variant="primary"
                            icon={<DownloadIcon fontSize="small" />}
                            fullWidth
                            onClick={handleDownloadFile}
                        >
                            Tải về
                        </ButtonComponent>
                    </StackRow>
                </Box>

                <FilePreviewDialog
                    open={previewOpen}
                    onClose={() => setPreviewOpen(false)}
                    file={file}
                />
            </Box>
        </Fade>
    )
}
