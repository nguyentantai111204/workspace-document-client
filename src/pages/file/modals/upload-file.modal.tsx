import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    IconButton,
    Typography,
    Box,
    useTheme
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined'
import { TextFieldUploadComponent } from '../../../components/field/text-field-upload.component'

interface UploadFileModalProps {
    open: boolean
    onClose: () => void
}

export const UploadFileModal = ({ open, onClose }: UploadFileModalProps) => {
    const theme = useTheme()

    const handleUpload = () => {
        // TODO: Implement upload logic
        onClose()
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    boxShadow: theme.shadows[10]
                }
            }}
        >
            <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h6" fontWeight={700}>
                        Tải tài liệu lên
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Thêm tài liệu vào không gian làm việc của bạn
                    </Typography>
                </Box>
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{ color: (theme) => theme.palette.grey[500] }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers sx={{ borderTop: 'none', borderBottom: 'none', px: 3, py: 2 }}>
                <TextFieldUploadComponent
                    icon={<CloudUploadOutlinedIcon sx={{ fontSize: 40 }} />}
                    title="Chọn tệp hoặc kéo thả vào đây"
                    subTitle="PDF, Excel, Images (Max 25MB)"
                />
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 3, pt: 1 }}>
                <Button onClick={onClose} color="inherit" sx={{ mr: 1, textTransform: 'none', fontWeight: 600 }}>
                    Hủy
                </Button>
                <Button
                    variant="contained"
                    onClick={handleUpload}
                    startIcon={<CloudUploadOutlinedIcon />}
                    sx={{
                        textTransform: 'none',
                        fontWeight: 600,
                        px: 3,
                        borderRadius: 2
                    }}
                >
                    Bắt đầu tải lên
                </Button>
            </DialogActions>
        </Dialog>
    )
}
