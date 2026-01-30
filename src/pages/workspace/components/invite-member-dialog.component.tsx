import { useState } from 'react'
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Box,
    Typography,
    IconButton,
    Stack,
    MenuItem,
    TextField
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { WorkspaceRole } from '../../../apis/workspace/workspace.interface'
import { inviteMemberApi } from '../../../apis/workspace/workspace.api'
import { useAppDispatch } from '../../../redux/store.redux'
import { showSnackbar } from '../../../redux/system/system.slice'
import { TextFieldSelectSearchComponent } from '../../../components/textfield/text-field-select-search.component'
import { ButtonComponent } from '../../../components/button/button.component'
import { UserResponse } from '../../../apis/user/user.interface'
import { useSnackbar } from '../../../hooks/use-snackbar.hook'

interface InviteMemberDialogProps {
    open: boolean
    onClose: () => void
    workspaceId: string
    onSuccess?: () => void
}

export const InviteMemberDialog = ({ open, onClose, workspaceId, onSuccess }: InviteMemberDialogProps) => {
    const dispatch = useAppDispatch()
    const { showError } = useSnackbar()
    const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null)
    const [role, setRole] = useState<WorkspaceRole>(WorkspaceRole.MEMBER)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async () => {
        if (!selectedUser) {
            showError('Vui lòng chọn người dùng')
            return
        }

        setIsSubmitting(true)
        try {
            await inviteMemberApi(workspaceId, { email: selectedUser.email, role })
            dispatch(showSnackbar({
                message: 'Đã gửi lời mời thành công!',
                severity: 'success'
            }))
            onSuccess?.()
            handleClose()
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || 'Không thể gửi lời mời'
            showError(errorMessage)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleClose = () => {
        setSelectedUser(null)
        setRole(WorkspaceRole.MEMBER)
        onClose()
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: { borderRadius: 2 },
                elevation: 2
            }}
        >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: { xs: 2.5, sm: 3 } }}>
                <Typography component="span" variant="h6" fontWeight={700} display="block" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
                    Mời thành viên
                </Typography>
                <IconButton onClick={handleClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: { xs: 2.5, sm: 3 } }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: { xs: 2, sm: 3 } }}>
                    Mời người dùng mới tham gia vào workspace để cùng làm việc.
                </Typography>

                <Stack spacing={{ xs: 2, sm: 3 }}>
                    <Box>
                        <TextFieldSelectSearchComponent
                            sizeUI="sm"
                            label="Tìm kiếm người dùng"
                            placeholder="Nhập email để tìm kiếm..."
                            value={selectedUser}
                            onSelectUser={setSelectedUser}
                        />
                    </Box>

                    <Box>
                        <Typography variant="body2" fontWeight={500} sx={{ mb: 1 }}>
                            Vai trò
                        </Typography>
                        <TextField
                            select
                            fullWidth
                            size="small"
                            value={role}
                            onChange={(e) => setRole(e.target.value as WorkspaceRole)}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2
                                }
                            }}
                        >
                            <MenuItem value={WorkspaceRole.ADMIN}>
                                <Box>
                                    <Typography variant="body2" fontWeight={500}>Admin</Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Có thể quản lý thành viên và cài đặt
                                    </Typography>
                                </Box>
                            </MenuItem>
                            <MenuItem value={WorkspaceRole.MEMBER}>
                                <Box>
                                    <Typography variant="body2" fontWeight={500}>Editor</Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Có thể chỉnh sửa và tạo tài liệu
                                    </Typography>
                                </Box>
                            </MenuItem>
                            <MenuItem value={WorkspaceRole.VIEWER}>
                                <Box>
                                    <Typography variant="body2" fontWeight={500}>Viewer</Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Chỉ có thể xem tài liệu
                                    </Typography>
                                </Box>
                            </MenuItem>
                        </TextField>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, pt: { xs: 2, sm: 2.5 } }}>
                        <ButtonComponent
                            sizeUI="sm"
                            variant="ghost"
                            onClick={handleClose}
                            disabled={isSubmitting}
                        >
                            Hủy
                        </ButtonComponent>
                        <ButtonComponent
                            sizeUI="sm"
                            variant="primary"
                            onClick={handleSubmit}
                            loading={isSubmitting}
                            disabled={!selectedUser}
                            icon={<PersonAddIcon />}
                        >
                            Gửi lời mời
                        </ButtonComponent>
                    </Box>
                </Stack>
            </DialogContent>
        </Dialog>
    )
}
