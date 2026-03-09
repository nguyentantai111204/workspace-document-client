import { Notification, NotificationType } from '../../apis/notification/notification.interface'
import { InviteNotificationItemComponent } from './items/invite-notification-item.component'
import { AppointmentNotificationItemComponent } from './items/appointment-notification-item.component'
import { DefaultNotificationItemComponent } from './items/default-notification-item.component'

export interface NotificationItemProps {
    notification: Notification
    onMarkAsRead: (id: string) => void
    onAcceptInvite?: (inviteToken: string, notificationId: string) => Promise<void>
    onDeclineInvite?: (notificationId: string) => Promise<void>
    onAcceptAppointment?: (workspaceId: string, appointmentId: string, notificationId: string) => Promise<void>
    onDeclineAppointment?: (workspaceId: string, appointmentId: string, notificationId: string) => Promise<void>
}

export const NotificationItemComponent = ({
    notification,
    onMarkAsRead,
    onAcceptInvite,
    onDeclineInvite,
    onAcceptAppointment,
    onDeclineAppointment
}: NotificationItemProps) => {

    switch (notification.type) {
        case NotificationType.INVITE:
            return (
                <InviteNotificationItemComponent
                    notification={notification}
                    onMarkAsRead={onMarkAsRead}
                    onAcceptInvite={onAcceptInvite}
                    onDeclineInvite={onDeclineInvite}
                />
            )
        case NotificationType.APPOINTMENT:
            return (
                <AppointmentNotificationItemComponent
                    notification={notification}
                    onMarkAsRead={onMarkAsRead}
                    onAcceptAppointment={onAcceptAppointment}
                    onDeclineAppointment={onDeclineAppointment}
                />
            )
        case NotificationType.SYSTEM:
        case NotificationType.WORKSPACE:
        case NotificationType.FILE:
        default:
            return (
                <DefaultNotificationItemComponent
                    notification={notification}
                    onMarkAsRead={onMarkAsRead}
                />
            )
    }
}
