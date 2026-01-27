import { Dialog, DialogContent, DialogTitle, IconButton, Box, Typography, DialogActions, Button } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { FileResponse } from '../../../../apis/file/file.interface'
import { DocxPreview } from './previewers/docx-preview.part'
import { PdfPreview } from './previewers/pdf-preview.part'
import { TextPreview } from './previewers/text-preview.part'
import { ImagePreview } from './previewers/image-preview.part'

interface FilePreviewDialogProps {
    open: boolean
    onClose: () => void
    file: FileResponse
}

export const FilePreviewDialog = ({ open, onClose, file }: FilePreviewDialogProps) => {

    const renderPreview = () => {
        const mimeType = file.mimeType

        if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            return <DocxPreview url={file.url} />
        }

        if (mimeType === 'application/pdf') {
            return <PdfPreview url={file.url} />
        }

        if (['text/plain', 'text/csv'].includes(mimeType)) {
            return <TextPreview url={file.url} />
        }

        if (mimeType.startsWith('image/')) {
            return <ImagePreview url={file.url} name={file.name} />
        }

        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: 400 }}>
                <Typography>Không hỗ trợ xem trước định dạng này.</Typography>
            </Box>
        )
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="lg"
            fullWidth
            PaperProps={{
                sx: {
                    height: '80vh',
                    maxHeight: '90vh',
                    display: 'flex',
                    flexDirection: 'column'
                }
            }}
        >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
                <Typography variant="h6" noWrap sx={{ maxWidth: '80%' }}>
                    {file.name}
                </Typography>
                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers sx={{ p: 3, flex: 1, overflowY: 'auto' }}>
                {renderPreview()}
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose} color="inherit">Đóng</Button>
                <Button onClick={() => window.open(file.url, '_blank')} variant="contained">
                    Mở trong tab mới
                </Button>
            </DialogActions>
        </Dialog>
    )
}
