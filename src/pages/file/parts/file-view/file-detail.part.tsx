import { Box, Typography, IconButton, Stack, Divider, useTheme, alpha, Fade } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import ShareIcon from '@mui/icons-material/Share'
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

export const FileDetailSidebar = ({ file, onClose }: FileDetailSidebarProps) => {
    const theme = useTheme()

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
                <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <InfoOutlinedIcon color="primary" fontSize="small" />
                        <Typography variant="subtitle2" fontWeight={600}>
                            Chi tiết
                        </Typography>
                    </Stack>
                    <IconButton size="small" onClick={onClose}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Box>

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

                    <Typography variant="subtitle1" fontWeight={600} align="center" gutterBottom>
                        {file.name}
                    </Typography>
                    <Typography noWrap variant="body2" color="text.secondary" align="center" sx={{ mb: 4, textTransform: 'uppercase', fontSize: 12, letterSpacing: 1, maxWidth: SIDEBAR_WIDTH }}>
                        {file.mimeType === 'folder' ? 'FOLDER' : file.mimeType.split('/')[1]?.toUpperCase() || 'FILE'}
                    </Typography>

                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, fontSize: 13, fontWeight: 600 }}>
                        THÔNG TIN
                    </Typography>

                    <Stack spacing={2} sx={{ mb: 4 }}>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">Loại</Typography>
                            <Typography variant="body2" fontWeight={500}>
                                {file.mimeType === 'folder' ? 'Thư mục' : 'File'}
                            </Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">Kích thước</Typography>
                            <Typography variant="body2" fontWeight={500}>
                                {file.mimeType === 'folder' ? '-' : formatFileSize(file.size)}
                            </Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">Ngày tạo</Typography>
                            <Typography variant="body2" fontWeight={500}>
                                {formatDateFile(file.createdAt)}
                            </Typography>
                        </Stack>
                    </Stack>
                </Box>

                <Box sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
                    <Stack direction="row" spacing={1}>
                        <ButtonComponent
                            variant="secondary"
                            icon={<ShareIcon fontSize="small" />}
                            fullWidth
                        >
                            Chia sẻ
                        </ButtonComponent>
                        <ButtonComponent
                            variant="primary"
                            icon={<DownloadIcon fontSize="small" />}
                            fullWidth
                        >
                            Tải về
                        </ButtonComponent>
                    </Stack>
                </Box>
            </Box>
        </Fade>
    )
}
