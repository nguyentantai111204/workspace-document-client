import { Box, Typography, Button, CircularProgress, Paper, Divider, Stack, Chip, Link } from '@mui/material'
import { useParams, useNavigate } from 'react-router-dom'
import useSWR, { mutate } from 'swr'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import PendingOutlinedIcon from '@mui/icons-material/PendingOutlined'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import { getAppointmentDetailApi, deleteAppointmentApi } from '../../apis/appointment/appointment.api'
import { StackColumn, StackRowAlignCenter } from '../../components/mui-custom/stack/stack.mui-custom'
import dayjs from 'dayjs'
import { useState } from 'react'
import { AppointmentEditPart } from './parts/appointment-update/appointment-update.part'
import { useSnackbar } from '../../hooks/use-snackbar.hook'
import { DialogComponent } from '../../components/dialog/dialog.component'
import { UserItemComponent } from '../../components/user/user-item.component'
import { useAppSelector } from '../../redux/store.redux'

const getStatusIcon = (status: string) => {
    switch (status) {
        case 'accepted': return <CheckCircleOutlineIcon fontSize="small" color="success" />
        case 'declined': return <CancelOutlinedIcon fontSize="small" color="error" />
        default: return <PendingOutlinedIcon fontSize="small" color="warning" />
    }
}

const getStatusLabel = (status: string) => {
    switch (status) {
        case 'accepted': return 'Tham gia'
        case 'declined': return 'Từ chối'
        default: return 'Chờ phản hồi'
    }
}

export const AppointmentDetailPage = () => {
    const { workspaceId, appointmentId } = useParams<{ workspaceId: string; appointmentId: string }>()
    const navigate = useNavigate()
    const { showSuccess, showError } = useSnackbar()

    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const currentUser = useAppSelector(state => state.account.user)

    const { data: appointment, isLoading: loadingAppointment, error } = useSWR(
        workspaceId && appointmentId ? ['appointmentDetail', workspaceId, appointmentId] : null,
        () => getAppointmentDetailApi(workspaceId as string, appointmentId as string)
    )

    const handleBack = () => {
        navigate(`/workspace/${workspaceId}/appointments`)
    }

    const handleDelete = async () => {
        if (!workspaceId || !appointmentId) return

        setIsDeleting(true)
        try {
            await deleteAppointmentApi(workspaceId, appointmentId)
            showSuccess('Xóa lịch hẹn thành công!')

            await mutate(
                (key) =>
                    Array.isArray(key) &&
                    key[0] === 'workspaceAppointments' &&
                    key[1] === workspaceId,
                undefined,
                { revalidate: true }
            )

            navigate(`/workspace/${workspaceId}/appointments`)
        } catch (err) {
            showError('Không thể xóa lịch hẹn. Vui lòng thử lại.')
            console.error('Delete failed', err)
        } finally {
            setIsDeleting(false)
            setIsDeleteDialogOpen(false)
        }
    }

    if (loadingAppointment) {
        return (
            <StackRowAlignCenter sx={{ height: '100%' }}>
                <CircularProgress />
            </StackRowAlignCenter>
        )
    }

    if (error || !appointment) {
        return (
            <Box sx={{ p: 4 }}>
                <Typography color="error">Không tìm thấy thông tin lịch hẹn hoặc có lỗi xảy ra.</Typography>
                <Button startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ mt: 2 }}>
                    Quay lại
                </Button>
            </Box>
        )
    }

    return (
        <StackColumn sx={{ p: { xs: 2, md: 4 }, flex: 1, maxWidth: 800, mx: 'auto', width: '100%' }}>
            <Box sx={{ mb: 3 }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={handleBack}
                    sx={{ mb: 2 }}
                >
                    Quay lại lịch
                </Button>
                <Typography variant="h4" fontWeight={700}>
                    Chi tiết cuộc họp
                </Typography>
            </Box>

            <Paper sx={{ p: { xs: 3, md: 4 }, borderRadius: 2 }}>
                <Typography variant="h5" sx={{ mb: 1, color: 'primary.main', fontWeight: 600 }}>
                    {appointment.title}
                </Typography>

                <StackRowAlignCenter spacing={1} sx={{ mb: 3 }}>
                    <Chip
                        label={appointment.status === 'scheduled' ? 'Đã lên lịch' : appointment.status}
                        color={appointment.status === 'scheduled' ? 'primary' : 'default'}
                        size="small"
                    />
                </StackRowAlignCenter>

                <Divider sx={{ mb: 4 }} />

                <Stack spacing={4}>
                    <Box>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>Mô tả</Typography>
                        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                            {appointment.description || 'Không có mô tả'}
                        </Typography>
                    </Box>

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={4}>
                        <Box flex={1}>
                            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>Thời gian bắt đầu</Typography>
                            <Typography variant="body1" fontWeight={500}>
                                {dayjs(appointment.startTime).format('HH:mm - DD/MM/YYYY')}
                            </Typography>
                        </Box>
                        <Box flex={1}>
                            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>Thời gian kết thúc</Typography>
                            <Typography variant="body1" fontWeight={500}>
                                {dayjs(appointment.endTime).format('HH:mm - DD/MM/YYYY')}
                            </Typography>
                        </Box>
                    </Stack>

                    {appointment.url && (
                        <Box>
                            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>Đường dẫn</Typography>
                            <Typography variant="body1">
                                <Link
                                    href={appointment.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    underline="hover"
                                >
                                    {appointment.url}
                                </Link>
                            </Typography>
                        </Box>
                    )}

                    <Box>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2, fontWeight: 600 }}>
                            Người tham gia ({appointment.participants?.length || 0})
                        </Typography>
                        <Stack
                            spacing={2}
                            sx={{
                                maxHeight: 500,
                                overflowY: 'auto',
                                pr: 1,
                                '&::-webkit-scrollbar': { width: '6px' },
                                '&::-webkit-scrollbar-track': { background: 'transparent' },
                                '&::-webkit-scrollbar-thumb': { background: '#bdbdbd', borderRadius: '10px' },
                                '&::-webkit-scrollbar-thumb:hover': { background: '#9e9e9e' }
                            }}
                        >
                            {appointment.participants?.slice().sort((a, b) => {
                                if (a.role === 'host') return -1;
                                if (b.role === 'host') return 1;
                                return 0;
                            }).map((participant) => {
                                const participantAction = (
                                    <StackRowAlignCenter gap={0.5}>
                                        {getStatusIcon(participant.responseStatus)}
                                        <Typography variant="caption" sx={{ display: { xs: 'none', sm: 'block' } }}>
                                            {getStatusLabel(participant.responseStatus)}
                                        </Typography>
                                    </StackRowAlignCenter>
                                )

                                return (
                                    <Box
                                        key={participant.id}
                                        sx={{
                                            bgcolor: 'background.default',
                                            borderRadius: 2,
                                            p: 0.5,
                                            border: '1px solid',
                                            borderColor: 'divider'
                                        }}
                                    >
                                        <UserItemComponent
                                            fullName={participant.fullName || participant.email || 'Người dùng ẩn danh'}
                                            email={participant.email || ''}
                                            avatarUrl={participant.avatarUrl}
                                            action={participantAction}
                                            sx={{ bgcolor: 'transparent', '&:hover': { bgcolor: 'transparent' }, p: 1 }}
                                        />
                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', ml: { xs: 5.5, sm: 6.5 }, mt: -1, pb: 1 }}>
                                            {participant.role === 'host' ? 'Người tổ chức' : 'Thành viên'}
                                        </Typography>
                                    </Box>
                                )
                            })}
                        </Stack>
                    </Box>
                </Stack>

                {currentUser && appointment.createdBy === currentUser.id && (
                    <Box sx={{ mt: 5, display: 'flex', gap: 2, pt: 3, borderTop: 1, borderColor: 'divider' }}>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<EditIcon />}
                            onClick={() => setIsEditModalOpen(true)}
                        >
                            Chỉnh sửa
                        </Button>
                        <Button
                            variant="outlined"
                            color="error"
                            startIcon={<DeleteIcon />}
                            onClick={() => setIsDeleteDialogOpen(true)}
                        >
                            Xóa lịch hẹn
                        </Button>
                    </Box>
                )}
            </Paper>

            {workspaceId && appointment && (
                <AppointmentEditPart
                    open={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    workspaceId={workspaceId}
                    appointment={appointment}
                />
            )}

            <DialogComponent
                open={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                title="Xác nhận xóa"
                onConfirm={handleDelete}
                confirmText="Xóa"
                cancelText="Hủy"
                loading={isDeleting}
            >
                <Typography variant="body1">
                    Bạn có chắc chắn muốn xóa cuộc họp <strong>{appointment.title}</strong> này không? Hành động này không thể hoàn tác.
                </Typography>
            </DialogComponent>
        </StackColumn>
    )
}
