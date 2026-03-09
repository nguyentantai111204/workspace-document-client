import { Notification } from '../../../apis/notification/notification.interface'
import { BaseNotificationItemComponent } from './base-notification-item.component'

export interface DefaultNotificationItemProps {
    notification: Notification
    onMarkAsRead: (id: string) => void
}

export const DefaultNotificationItemComponent = ({
    notification,
    onMarkAsRead
}: DefaultNotificationItemProps) => {
    return (
        <BaseNotificationItemComponent notification={notification} onMarkAsRead={onMarkAsRead} />
    )
}
