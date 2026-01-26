
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Box,
    useTheme,
    LinearProgress,
    Alert
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined'
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import { TextFieldUploadComponent } from '../../../components/field/text-field-upload.component'
import { useState, useRef } from 'react'
import { useWorkspace } from '../../../contexts/workspace.context'
import { uploadFilesApi } from '../../../apis/file/file.api'
import { formatFileSize } from '../../../common/utils/file.utils'
import { ButtonComponent } from '../../../components/button/button.component'
import { StackRowAlignCenterJustBetween, StackRow } from '../../../components/mui-custom/stack/stack.mui-custom'

interface UploadFileModalProps {
    open: boolean
    onClose: () => void
    onSuccess?: () => void
}

export const UploadFileModal = ({ open, onClose, onSuccess }: UploadFileModalProps) => {
    const theme = useTheme()
    const { currentWorkspace } = useWorkspace()
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [selectedFiles, setSelectedFiles] = useState<File[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleFileSelect = (files: File[]) => {
        const validFiles: File[] = []
        let hasError = false

        files.forEach(file => {
            if (file.size > 25 * 1024 * 1024) { // 25MB limit
                setError(`File ${file.name} vượt quá giới hạn 25MB`)
                hasError = true
            } else {
                validFiles.push(file)
            }
        })

        if (!hasError) setError(null)

        setSelectedFiles(prev => [...prev, ...validFiles])
    }

    const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            handleFileSelect(Array.from(event.target.files))
        }
    }

    const handleRemoveFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index))
        setError(null)
    }

    const handleUpload = async () => {
        if (selectedFiles.length === 0 || !currentWorkspace) return

        setIsLoading(true)
        setError(null)

        try {
            const { failed } = await uploadFilesApi(currentWorkspace.id, selectedFiles)

            if (failed.length > 0) {
                const failedNames = failed.map(f => f.file.name).join(', ')
                setError(`Không thể tải lên ${failed.length} tệp tin: ${failedNames} `)
                // Keep selected files that failed? Or just close?
                // For now, if any succeed, we trigger success.
                if (failed.length < selectedFiles.length) {
                    onSuccess?.()
                }
            } else {
                onSuccess?.()
                handleClose()
            }
        } catch (err) {
            console.error('Upload failed:', err)
            setError('Có lỗi xảy ra khi tải lên tài liệu. Vui lòng thử lại.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleClose = () => {
        setSelectedFiles([])
        setError(null)
        setIsLoading(false)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
        onClose()
    }

    return (
        <Dialog
            open={open}
            onClose={isLoading ? undefined : handleClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    boxShadow: theme.shadows[10]
                }
            }}
        >
            <DialogTitle sx={{ m: 0, p: 2 }}>
                <StackRowAlignCenterJustBetween>
                    <Box>
                        <Typography variant="h6" fontWeight={700}>
                            Tải tài liệu lên
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Thêm tài liệu vào không gian làm việc của bạn
                        </Typography>
                    </Box>
                    {!isLoading && (
                        <ButtonComponent
                            variant="ghost"
                            shape="circle"
                            sizeUI="sm"
                            icon={<CloseIcon />}
                            onClick={handleClose}
                            sx={{ color: theme.palette.grey[500] }}
                        />
                    )}
                </StackRowAlignCenterJustBetween>
            </DialogTitle>

            <DialogContent dividers sx={{ borderTop: 'none', borderBottom: 'none', px: 3, py: 2 }}>
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileInputChange}
                    multiple
                // accept="image/*,application/pdf,application/vnd.ms-excel" // Optional: restrict types
                />

                <TextFieldUploadComponent
                    icon={<CloudUploadOutlinedIcon sx={{ fontSize: 40 }} />}
                    title="Chọn tệp hoặc kéo thả vào đây"
                    subTitle="PDF, Excel, Images (Max 25MB)"
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={(files) => {
                        if (files.length > 0) handleFileSelect(files)
                    }}
                />

                {selectedFiles.length > 0 && (
                    <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Typography variant="subtitle2" fontWeight={600}>
                            File đã chọn ({selectedFiles.length})
                        </Typography>
                        {selectedFiles.map((file, index) => (
                            <Box
                                key={index}
                                sx={{
                                    p: 1.5,
                                    border: `1px solid ${theme.palette.divider} `,
                                    borderRadius: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                    bgcolor: (theme) => theme.palette.background.default
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 1,
                                        bgcolor: (theme) => theme.palette.primary.light,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'primary.main',
                                        flexShrink: 0
                                    }}
                                >
                                    <InsertDriveFileOutlinedIcon fontSize="small" />
                                </Box>
                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                    <Typography variant="body2" noWrap fontWeight={500}>
                                        {file.name}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {formatFileSize(file.size)}
                                    </Typography>
                                </Box>
                                {!isLoading && (
                                    <ButtonComponent
                                        variant="ghost"
                                        shape="circle"
                                        sizeUI="sm"
                                        icon={<DeleteOutlineOutlinedIcon fontSize="small" />}
                                        onClick={() => handleRemoveFile(index)}
                                        sx={{ color: theme.palette.error.main }}
                                    />
                                )}
                            </Box>
                        ))}
                    </Box>
                )}

                {isLoading && (
                    <Box sx={{ mt: 2 }}>
                        <LinearProgress sx={{ borderRadius: 1, height: 6 }} />
                        <Typography variant="caption" color="text.secondary" align="center" display="block" sx={{ mt: 1 }}>
                            Đang tải lên {selectedFiles.length} file...
                        </Typography>
                    </Box>
                )}

                {error && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {error}
                    </Alert>
                )}
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 3, pt: 1 }}>
                <StackRow spacing={1} justifyContent="flex-end" width="100%">
                    <ButtonComponent
                        onClick={handleClose}
                        variant="ghost"
                        disabled={isLoading}
                    >
                        Hủy
                    </ButtonComponent>
                    <ButtonComponent
                        variant="primary"
                        onClick={handleUpload}
                        disabled={selectedFiles.length === 0 || isLoading}
                        icon={!isLoading ? <CloudUploadOutlinedIcon /> : undefined}
                        loading={isLoading}
                    >
                        {isLoading ? 'Đang xử lý...' : `Tải lên(${selectedFiles.length})`}
                    </ButtonComponent>
                </StackRow>
            </DialogActions>
        </Dialog>
    )
}
