import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, IconButton, Typography, Box } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import AddIcon from '@mui/icons-material/Add'
import { useState } from 'react'
import { useWorkspace } from '../../contexts/workspace.context'

interface CreateWorkspaceDialogProps {
    open: boolean
    onClose: () => void
}

export const CreateWorkspaceDialog = ({ open, onClose }: CreateWorkspaceDialogProps) => {
    const { createWorkspace } = useWorkspace()
    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async () => {
        if (!name.trim()) return

        setLoading(true)
        setError(null)
        try {
            await createWorkspace({ name })
            onClose()
            setName('')
        } catch (err) {
            setError('Có lỗi xảy ra khi tạo workspace.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: { borderRadius: 2 }
            }}
        >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 3 }}>
                <Typography variant="h6" fontWeight={700}>
                    Tạo Workspace mới
                </Typography>
                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 3 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Workspace là nơi bạn và team lưu trữ, sắp xếp tài liệu.
                </Typography>

                <TextField
                    autoFocus
                    fullWidth
                    label="Tên Workspace"
                    placeholder="VD: Dự án Marketing, Tài liệu cá nhân..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    error={!!error}
                    helperText={error}
                    disabled={loading}
                />
            </DialogContent>

            <DialogActions sx={{ p: 3 }}>
                <Button onClick={onClose} color="inherit" disabled={loading}>Hủy</Button>
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    startIcon={<AddIcon />}
                    disabled={!name.trim() || loading}
                >
                    {loading ? 'Đang tạo...' : 'Tạo Workspace'}
                </Button>
            </DialogActions>
        </Dialog>
    )
}
