import {
    Typography,
    Box,
    useTheme,
    LinearProgress,
    Alert
} from '@mui/material'
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined'
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import { TextFieldUploadComponent } from '../../../components/textfield/text-field-upload.component'
import { useState, useRef } from 'react'
import { useWorkspace } from '../../../contexts/workspace.context'
import { uploadFilesApi } from '../../../apis/file/file.api'
import { formatFileSize } from '../../../common/utils/file.utils'
import { ButtonComponent } from '../../../components/button/button.component'
import { StackColumn, StackRow, StackRowAlignCenter, StackRowAlignStartJustCenter } from '../../../components/mui-custom/stack/stack.mui-custom'
import { DialogComponent } from '../../../components/dialog/dialog.component'
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
        if (isLoading) return
        setSelectedFiles([])
        setError(null)
        setIsLoading(false)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
        onClose()
    }

    return (
        <DialogComponent
            open={open}
            onClose={handleClose}
            title="Tải tài liệu lên"
            maxWidth="sm"
            fullWidth
            renderActions={() => (
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
                        {isLoading ? 'Đang xử lý...' : `Tải lên (${selectedFiles.length})`}
                    </ButtonComponent>
                </StackRow>
            )}
        >
            <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                    Thêm tài liệu vào không gian làm việc của bạn
                </Typography>
            </Box>

            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileInputChange}
                multiple
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
                <StackColumn sx={{ mt: 2, gap: 1 }}>
                    <Typography variant="subtitle2" fontWeight={600}>
                        File đã chọn ({selectedFiles.length})
                    </Typography>
                    {selectedFiles.map((file, index) => (
                        <StackRowAlignCenter
                            key={index}
                            sx={{
                                p: 1.5,
                                border: `1px solid ${theme.palette.divider}`,
                                borderRadius: 2,
                                gap: 2,
                                bgcolor: (theme) => theme.palette.background.default
                            }}
                        >
                            <StackRowAlignStartJustCenter
                                sx={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 1,
                                    bgcolor: (theme) => theme.palette.primary.light,
                                    color: 'primary.main',
                                    flexShrink: 0
                                }}
                            >
                                <InsertDriveFileOutlinedIcon fontSize="small" />
                            </StackRowAlignStartJustCenter>
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
                        </StackRowAlignCenter>
                    ))}
                </StackColumn>
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
        </DialogComponent>
    )
}
