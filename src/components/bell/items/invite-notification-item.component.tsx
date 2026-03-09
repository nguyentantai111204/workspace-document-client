import { useState } from 'react'
import { Button, CircularProgress } from '@mui/material'
import { Notification } from '../../../apis/notification/notification.interface'
import { BaseNotificationItemComponent } from './base-notification-item.component'
import { StackRow } from '../../mui-custom/stack/stack.mui-custom'

export interface InviteNotificationItemProps {
    notification: Notification
    onMarkAsRead: (id: string) => void
    onAcceptInvite?: (inviteToken: string, notificationId: string) => Promise<void>
    onDeclineInvite?: (notificationId: string) => Promise<void>
}

export const InviteNotificationItemComponent = ({
    notification,
    onMarkAsRead,
    onAcceptInvite,
    onDeclineInvite
}: InviteNotificationItemProps) => {
    const [isAccepting, setIsAccepting] = useState(false)
    const [isDeclining, setIsDeclining] = useState(false)

    const handleAcceptInvite = async (e: React.MouseEvent) => {
        e.stopPropagation()
        if (!notification.data?.inviteToken || !onAcceptInvite) return

        setIsAccepting(true)
        try {
            await onAcceptInvite(notification.data.inviteToken, notification.id)
        } catch (error) {
            console.error('Failed to accept invite:', error)
        } finally {
            setIsAccepting(false)
        }
    }

    const handleDeclineInvite = async (e: React.MouseEvent) => {
        e.stopPropagation()
        if (!onDeclineInvite) return

        setIsDeclining(true)
        try {
            await onDeclineInvite(notification.id)
        } catch (error) {
            console.error('Failed to decline invite:', error)
        } finally {
            setIsDeclining(false)
        }
    }

    const isExpired = notification.data?.expiresAt && new Date(notification.data.expiresAt).getTime() <= Date.now()
    const isAppointmentInvite = !!notification.data?.appointmentId

    return (
        <BaseNotificationItemComponent notification={notification} onMarkAsRead={onMarkAsRead}>
            {!isAppointmentInvite && !isExpired && (
                <StackRow gap={1} sx={{ mt: 1.5 }}>
                    <Button
                        variant="contained"
                        size="small"
                        onClick={handleAcceptInvite}
                        disabled={isAccepting || isDeclining}
                        sx={{ minWidth: 100 }}
                    >
                        {isAccepting ? <CircularProgress size={16} /> : 'Tham gia'}
                    </Button>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={handleDeclineInvite}
                        disabled={isAccepting || isDeclining}
                    >
                        {isDeclining ? <CircularProgress size={16} /> : 'Từ chối'}
                    </Button>
                </StackRow>
            )}
        </BaseNotificationItemComponent>
    )
}
