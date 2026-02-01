import { useState } from 'react'
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    TextField,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    Chip,
    Typography,
    Stack
} from '@mui/material'
import { useWorkspace } from '../../../contexts/workspace.context'
import { useWorkspaceMembers } from '../../../hooks/use-workspace-member.hook'
import { createConversationApi } from '../../../apis/chat/chat.api'
import { ConversationType } from '../../../apis/chat/chat.interface'
import { useAppDispatch } from '../../../redux/store.redux'
import { showSnackbar } from '../../../redux/system/system.slice'
import { MemberResponse } from '../../../apis/workspace/workspace.interface'
import { PAGE_LIMIT_DEFAULT } from '../../../common/constant/page-take.constant'

interface CreateConversationDialogProps {
    open: boolean
    onClose: () => void
    onSuccess?: (conversationId: string) => void
}

export const CreateConversationDialog = ({
    open,
    onClose,
    onSuccess
}: CreateConversationDialogProps) => {
    const dispatch = useAppDispatch()
    const { currentWorkspace } = useWorkspace()
    const [conversationType, setConversationType] = useState<ConversationType>('DIRECT')
    const [groupName, setGroupName] = useState('')
    const [selectedMembers, setSelectedMembers] = useState<MemberResponse[]>([])
    const [searchQuery, setSearchQuery] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Fetch workspace members
    const { members } = useWorkspaceMembers(currentWorkspace?.id, {
        search: searchQuery || undefined,
        page: 1,
        limit: PAGE_LIMIT_DEFAULT.limit
    })

    const handleToggleMember = (member: MemberResponse) => {
        setSelectedMembers(prev => {
            const exists = prev.find(m => m.userId === member.userId)
            if (exists) {
                return prev.filter(m => m.userId !== member.userId)
            }
            return [...prev, member]
        })
    }

    const handleSubmit = async () => {
        if (!currentWorkspace) return

        // Validation
        if (conversationType === 'GROUP' && !groupName.trim()) {
            dispatch(showSnackbar({
                message: 'Vui lòng nhập tên nhóm',
                severity: 'error'
            }))
            return
        }

        if (selectedMembers.length === 0) {
            dispatch(showSnackbar({
                message: 'Vui lòng chọn ít nhất một thành viên',
                severity: 'error'
            }))
            return
        }

        if (conversationType === 'DIRECT' && selectedMembers.length > 1) {
            dispatch(showSnackbar({
                message: 'Tin nhắn trực tiếp chỉ có thể với 1 người',
                severity: 'error'
            }))
            return
        }

        setIsSubmitting(true)
        try {
            const response = await createConversationApi(currentWorkspace.id, {
                type: conversationType,
                name: conversationType === 'GROUP' ? groupName : undefined,
                participantIds: selectedMembers.map(m => m.userId)
            })

            dispatch(showSnackbar({
                message: 'Đã tạo cuộc trò chuyện',
                severity: 'success'
            }))

            // Reset form
            setGroupName('')
            setSelectedMembers([])
            setConversationType('DIRECT')
            setSearchQuery('')

            onSuccess?.(response.id)
            onClose()
        } catch (error: any) {
            dispatch(showSnackbar({
                message: error.response?.data?.message || 'Không thể tạo cuộc trò chuyện',
                severity: 'error'
            }))
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleClose = () => {
        if (!isSubmitting) {
            setGroupName('')
            setSelectedMembers([])
            setConversationType('DIRECT')
            setSearchQuery('')
            onClose()
        }
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2
                }
            }}
        >
            <DialogTitle>Tạo cuộc trò chuyện mới</DialogTitle>

            <DialogContent>
                <Stack spacing={3} sx={{ mt: 1 }}>
                    {/* Conversation Type */}
                    <FormControl>
                        <FormLabel>Loại cuộc trò chuyện</FormLabel>
                        <RadioGroup
                            row
                            value={conversationType}
                            onChange={(e) => {
                                setConversationType(e.target.value as ConversationType)
                                setSelectedMembers([]) // Reset selection when changing type
                            }}
                        >
                            <FormControlLabel
                                value="DIRECT"
                                control={<Radio />}
                                label="Trực tiếp (1-1)"
                            />
                            <FormControlLabel
                                value="GROUP"
                                control={<Radio />}
                                label="Nhóm"
                            />
                        </RadioGroup>
                    </FormControl>

                    {/* Group Name (only for GROUP type) */}
                    {conversationType === 'GROUP' && (
                        <TextField
                            label="Tên nhóm"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            placeholder="Nhập tên nhóm..."
                            required
                            fullWidth
                        />
                    )}

                    {/* Member Search */}
                    <TextField
                        label="Tìm thành viên"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Nhập tên hoặc email..."
                        fullWidth
                        size="small"
                    />

                    {/* Selected Members */}
                    {selectedMembers.length > 0 && (
                        <Box>
                            <Typography variant="caption" color="text.secondary" gutterBottom>
                                Đã chọn ({selectedMembers.length})
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                                {selectedMembers.map((member) => (
                                    <Chip
                                        key={member.userId}
                                        label={member.fullName}
                                        onDelete={() => handleToggleMember(member)}
                                        size="small"
                                        color="primary"
                                        variant="outlined"
                                    />
                                ))}
                            </Box>
                        </Box>
                    )}

                    {/* Member List */}
                    <Box>
                        <Typography variant="caption" color="text.secondary" gutterBottom>
                            Thành viên trong workspace
                        </Typography>
                        <Box
                            sx={{
                                maxHeight: 300,
                                overflow: 'auto',
                                mt: 1,
                                border: 1,
                                borderColor: 'divider',
                                borderRadius: 1,
                                p: 1
                            }}
                        >
                            {members.length === 0 ? (
                                <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 2 }}>
                                    Không tìm thấy thành viên
                                </Typography>
                            ) : (
                                <Stack spacing={0.5}>
                                    {members.map((member) => {
                                        const isSelected = selectedMembers.some(m => m.userId === member.userId)
                                        const isDisabled = conversationType === 'DIRECT' && selectedMembers.length > 0 && !isSelected

                                        return (
                                            <Box
                                                key={member.userId}
                                                onClick={() => !isDisabled && handleToggleMember(member)}
                                                sx={{
                                                    p: 1.5,
                                                    borderRadius: 1,
                                                    cursor: isDisabled ? 'not-allowed' : 'pointer',
                                                    bgcolor: isSelected ? 'action.selected' : 'transparent',
                                                    opacity: isDisabled ? 0.5 : 1,
                                                    '&:hover': {
                                                        bgcolor: isDisabled ? 'transparent' : isSelected ? 'action.selected' : 'action.hover'
                                                    }
                                                }}
                                            >
                                                <Typography variant="body2" fontWeight={isSelected ? 600 : 400}>
                                                    {member.fullName}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {member.email}
                                                </Typography>
                                            </Box>
                                        )
                                    })}
                                </Stack>
                            )}
                        </Box>
                    </Box>
                </Stack>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={handleClose} disabled={isSubmitting}>
                    Hủy
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={isSubmitting || selectedMembers.length === 0}
                >
                    {isSubmitting ? 'Đang tạo...' : 'Tạo'}
                </Button>
            </DialogActions>
        </Dialog>
    )
}
