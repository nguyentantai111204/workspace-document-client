import {
    Avatar,
    Box,
    Typography,
} from '@mui/material'
import WorkspacesIcon from '@mui/icons-material/Workspaces'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'
import InfoIcon from '@mui/icons-material/Info'
import FavoriteIcon from '@mui/icons-material/Favorite'
import CommentIcon from '@mui/icons-material/Comment'
import EventIcon from '@mui/icons-material/Event'
import { TimeAgoComponent } from '../../time/time-ago.component'
import { Notification, NotificationType } from '../../../apis/notification/notification.interface'
import { StackRow } from '../../mui-custom/stack/stack.mui-custom'

export interface BaseNotificationItemProps {
    notification: Notification
    onMarkAsRead: (id: string) => void
    children?: React.ReactNode
}

export const BaseNotificationItemComponent = ({
    notification,
    onMarkAsRead,
    children
}: BaseNotificationItemProps) => {

    const handleClick = () => {
        if (!notification.isRead) {
            onMarkAsRead(notification.id)
        }
    }

    const getNotificationIcon = () => {
        switch (notification.type) {
            case NotificationType.INVITE:
                return <WorkspacesIcon sx={{ fontSize: 30, color: 'primary.main' }} />
            case NotificationType.WORKSPACE:
                return <WorkspacesIcon sx={{ fontSize: 30, color: 'info.main' }} />
            case NotificationType.FILE:
                return <InsertDriveFileIcon sx={{ fontSize: 30, color: 'success.main' }} />
            case NotificationType.APPOINTMENT:
                return <EventIcon sx={{ fontSize: 30, color: 'warning.main' }} />
            case NotificationType.SYSTEM:
                return <InfoIcon sx={{ fontSize: 30, color: 'text.secondary' }} />
            default:
                return <InfoIcon sx={{ fontSize: 30, color: 'text.secondary' }} />
        }
    }

    const getActionIcon = () => {
        if (notification.data?.action === 'liked') {
            return <FavoriteIcon sx={{ fontSize: 16, color: 'error.main', ml: 0.5 }} />
        }
        if (notification.data?.action === 'commented') {
            return <CommentIcon sx={{ fontSize: 16, color: 'primary.main', ml: 0.5 }} />
        }
        return null
    }

    return (
        <StackRow
            gap={1.5}
            onClick={handleClick}
            sx={{
                px: 2,
                py: 1.5,
                cursor: 'pointer',
                bgcolor: notification.isRead ? 'transparent' : 'action.hover',
                '&:hover': {
                    bgcolor: 'action.hover',
                },
                position: 'relative',
                borderBottom: '1px solid',
                borderColor: 'divider',
            }}
        >
            {notification.senderId && notification.data?.senderAvatar ? (
                <Avatar src={notification.data.senderAvatar} sx={{ width: 40, height: 40 }} />
            ) : (
                <Box
                    sx={{
                        width: 40,
                        height: 40,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%',
                        bgcolor: 'action.selected'
                    }}
                >
                    {getNotificationIcon()}
                </Box>
            )}

            <Box flex={1}>
                <Typography variant="body2">
                    <Box component="span" sx={{ fontWeight: 600 }}>
                        {notification.title}
                    </Box>
                </Typography>

                <Typography
                    variant="body2"
                    sx={{
                        color: 'text.secondary',
                        mt: 0.5,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }}
                >
                    {notification.body}
                    {getActionIcon()}
                </Typography>

                {children}

                <TimeAgoComponent value={notification.createdAt} />
            </Box>

            {!notification.isRead && (
                <Box
                    sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: 'primary.main',
                        alignSelf: 'center'
                    }}
                />
            )}
        </StackRow>
    )
}
