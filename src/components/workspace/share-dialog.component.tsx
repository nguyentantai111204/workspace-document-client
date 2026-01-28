import { Dialog, DialogTitle, DialogContent, Box, Typography, IconButton, Stack, Chip, alpha, useTheme, CircularProgress } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { useState } from 'react'
import { TextFieldSelectSearchComponent } from '../textfield/text-field-select-search.component'
import { ButtonComponent } from '../button/button.component'
import { useWorkspace } from '../../contexts/workspace.context'
import { useWorkspaceMembers } from '../../hooks/useWorkspaceMembers'
import { inviteMemberApi } from '../../apis/workspace/workspace.api'
import { useAppDispatch } from '../../redux/store.redux'
import { showSnackbar } from '../../redux/system/system.slice'
import { UserResponse } from '../../apis/user/user.interface'
import { UserItemComponent } from '../user/user-item.component'

interface ShareDialogProps {
    open: boolean
    onClose: () => void
}



export const ShareDialog = ({ open, onClose }: ShareDialogProps) => {
    const theme = useTheme()
    const dispatch = useAppDispatch()
    const { currentWorkspace } = useWorkspace()
    const { members, isLoading: isLoadingMembers, mutate } = useWorkspaceMembers(currentWorkspace?.id)
    const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string>('')

    const handleInvite = async () => {
        if (!selectedUser || !currentWorkspace) {
            setError('Vui lòng chọn người dùng')
            return
        }

        setIsSubmitting(true)
        setError('')

        try {
            await inviteMemberApi(currentWorkspace.id, {
                email: selectedUser.email,
                role: 'MEMBER'
            })

            dispatch(showSnackbar({ message: 'Đã gửi lời mời thành công!', severity: 'success' }))
            setSelectedUser(null)
            mutate()
            onClose()
        } catch (err: any) {
            const errorMessage = err?.response?.data?.message || 'Có lỗi xảy ra khi gửi lời mời'
            setError(errorMessage)
            dispatch(showSnackbar({ message: errorMessage, severity: 'error' }))
        } finally {
            setIsSubmitting(false)
        }
    }



    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: { borderRadius: 2 },
                elevation: 2
            }}
        >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: { xs: 2.5, sm: 3 } }}>
                <Typography component="span" variant="h6" fontWeight={700} display="block" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
                    Chia sẻ Workspace
                </Typography>
                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: { xs: 2.5, sm: 3 } }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: { xs: 2, sm: 3 } }}>
                    Mời thành viên mới tham gia vào workspace để cùng làm việc.
                </Typography>

                <Stack spacing={{ xs: 2, sm: 3 }}>
                    <Box>
                        <TextFieldSelectSearchComponent
                            sizeUI="sm"
                            label="Tìm kiếm người dùng"
                            placeholder="Nhập email để tìm kiếm..."
                            value={selectedUser}
                            onSelectUser={setSelectedUser}
                            errorMessage={error}
                        />
                    </Box>

                    <Box>
                        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
                            Thành viên hiện tại
                        </Typography>
                        {isLoadingMembers ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                                <CircularProgress size={24} />
                            </Box>
                        ) : members.length === 0 ? (
                            <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                                Chưa có thành viên nào
                            </Typography>
                        ) : (
                            <Stack spacing={1.5}>
                                {members.map((member) => (
                                    <UserItemComponent
                                        key={member.userId}
                                        avatarUrl={member.avatarUrl}
                                        fullName={member.fullName}
                                        email={member.email}
                                        action={<Chip label={member.role} size="small" variant="outlined" sx={{ height: 22, fontSize: '0.625rem' }} />}
                                        sx={{
                                            '&:hover': { bgcolor: alpha(theme.palette.grey[500], 0.08) }
                                        }}
                                    />
                                ))}
                            </Stack>
                        )}
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, pt: { xs: 2, sm: 2.5 }, borderTop: `1px solid ${theme.palette.divider}` }}>
                        <ButtonComponent
                            sizeUI="sm"
                            variant="ghost"
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            Hủy
                        </ButtonComponent>
                        <ButtonComponent
                            sizeUI="sm"
                            variant="primary"
                            onClick={handleInvite}
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
