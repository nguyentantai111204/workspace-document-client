import { useState } from 'react'
import { Button, CircularProgress } from '@mui/material'
import { Notification } from '../../../apis/notification/notification.interface'
import { BaseNotificationItemComponent } from './base-notification-item.component'
import { StackRow } from '../../mui-custom/stack/stack.mui-custom'

export interface AppointmentNotificationItemProps {
    notification: Notification
    onMarkAsRead: (id: string) => void
    onAcceptAppointment?: (workspaceId: string, appointmentId: string, notificationId: string) => Promise<void>
    onDeclineAppointment?: (workspaceId: string, appointmentId: string, notificationId: string) => Promise<void>
}

export const AppointmentNotificationItemComponent = ({
    notification,
    onMarkAsRead,
    onAcceptAppointment,
    onDeclineAppointment
}: AppointmentNotificationItemProps) => {
    const [isAccepting, setIsAccepting] = useState(false)
    const [isDeclining, setIsDeclining] = useState(false)

    const handleAcceptAppointment = async (e: React.MouseEvent) => {
        e.stopPropagation()
        if (!onAcceptAppointment) return

        if (!notification.data?.workspaceId || !notification.data?.appointmentId) {
            alert('Thông báo này được tạo từ phiên bản cũ không có chứa ID Thư mục (Workspace) nên không thể thực hiện phản hồi nhanh. Vui lòng tạo một cuộc hẹn mới để thử lại.')
            return
        }

        setIsAccepting(true)
        try {
            await onAcceptAppointment(notification.data.workspaceId, notification.data.appointmentId, notification.id)
        } catch (error) {
            console.error('Failed to accept appointment:', error)
        } finally {
            setIsAccepting(false)
        }
    }

    const handleDeclineAppointment = async (e: React.MouseEvent) => {
        e.stopPropagation()
        if (!onDeclineAppointment) return

        if (!notification.data?.workspaceId || !notification.data?.appointmentId) {
            alert('Thông báo này được tạo từ phiên bản cũ không có chứa ID Thư mục (Workspace) nên không thể thực hiện phản hồi nhanh. Vui lòng tạo một cuộc hẹn mới để thử lại.')
            return
        }

        setIsDeclining(true)
        try {
            await onDeclineAppointment(notification.data.workspaceId, notification.data.appointmentId, notification.id)
        } catch (error) {
            console.error('Failed to decline appointment:', error)
        } finally {
            setIsDeclining(false)
        }
    }

    const isExpired = notification.data?.expiresAt && new Date(notification.data.expiresAt).getTime() <= Date.now()
    const isEventAction = !!notification.data?.event

    return (
        <BaseNotificationItemComponent notification={notification} onMarkAsRead={onMarkAsRead}>
            {!isEventAction && !isExpired && (
                <StackRow gap={1} sx={{ mt: 1.5 }}>
                    <Button
                        variant="contained"
                        size="small"
                        onClick={handleAcceptAppointment}
                        disabled={isAccepting || isDeclining}
                        sx={{ minWidth: 100 }}
                    >
                        {isAccepting ? <CircularProgress size={16} /> : 'Chấp nhận'}
                    </Button>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={handleDeclineAppointment}
                        disabled={isAccepting || isDeclining}
                    >
                        {isDeclining ? <CircularProgress size={16} /> : 'Từ chối'}
                    </Button>
                </StackRow>
            )}
        </BaseNotificationItemComponent>
    )
}
