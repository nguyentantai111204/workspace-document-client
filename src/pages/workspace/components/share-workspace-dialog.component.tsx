import { Box, Typography, Stack, Chip, alpha, useTheme, CircularProgress } from '@mui/material'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { DialogComponent } from '../../../components/dialog/dialog.component'
import { StackColumnAlignStart, StackRow } from '../../../components/mui-custom/stack/stack.mui-custom'
import { useState } from 'react'
import { TextFieldSelectSearchComponent } from '../../../components/textfield/text-field-select-search.component'
import { ButtonComponent } from '../../../components/button/button.component'
import { useWorkspace } from '../../../contexts/workspace.context'
import { useWorkspaceMembers } from '../../../hooks/use-workspace-member.hook'
import { inviteMemberApi } from '../../../apis/workspace/workspace.api'
import { useAppDispatch } from '../../../redux/store.redux'
import { showSnackbar } from '../../../redux/system/system.slice'
import { UserResponse } from '../../../apis/user/user.interface'
import { UserItemComponent } from '../../../components/user/user-item.component'
import { useSnackbar } from '../../../hooks/use-snackbar.hook'

interface ShareWorkspaceDialogProps {
    open: boolean
    onClose: () => void
}



export const ShareWorkspaceDialog = ({ open, onClose }: ShareWorkspaceDialogProps) => {
    const theme = useTheme()
    const dispatch = useAppDispatch()
    const { currentWorkspace } = useWorkspace()
    const { members, isLoading: isLoadingMembers, mutate } = useWorkspaceMembers(open ? currentWorkspace?.id : undefined)
    const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { showError } = useSnackbar()


    const handleInvite = async () => {
        if (!selectedUser || !currentWorkspace) {
            showError('Vui lòng chọn người dùng')
            return
        }

        setIsSubmitting(true)

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
            showError(errorMessage)
        } finally {
            setIsSubmitting(false)
        }
    }



    return (
        <DialogComponent
            open={open}
            onClose={onClose}
            title={<StackColumnAlignStart>
                <Typography variant="h6" fontWeight={600} component="div">
                    Chia sẻ Workspace
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Mời người dùng mới tham gia vào workspace để cùng làm việc.
                </Typography>
            </StackColumnAlignStart>}
            maxWidth="sm"
            fullWidth
            renderActions={() => (
                <StackRow spacing={1} justifyContent="flex-end" width="100%">
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
                </StackRow>
            )}
        >

            <Stack spacing={{ xs: 2, sm: 3 }} sx={{ pt: 2, pb: 2 }}>
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

            </Stack>
        </DialogComponent>
    )
}
