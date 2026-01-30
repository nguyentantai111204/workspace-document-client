import {
    Avatar,
    Box,
    Stack,
    Typography,
    Button,
    CircularProgress
} from '@mui/material'
import WorkspacesIcon from '@mui/icons-material/Workspaces'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'
import InfoIcon from '@mui/icons-material/Info'
import FavoriteIcon from '@mui/icons-material/Favorite'
import CommentIcon from '@mui/icons-material/Comment'
import { TimeAgoComponent } from '../time/time-ago.component'
import { Notification, NotificationType } from '../../apis/notification/notification.interface'
import { useState } from 'react'

interface NotificationItemProps {
    notification: Notification
    onMarkAsRead: (id: string) => void
    onAcceptInvite?: (inviteToken: string, notificationId: string) => Promise<void>
    onDeclineInvite?: (notificationId: string) => Promise<void>
}

export const NotificationItemComponent = ({
    notification,
    onMarkAsRead,
    onAcceptInvite,
    onDeclineInvite
}: NotificationItemProps) => {
    const [isAccepting, setIsAccepting] = useState(false)
    const [isDeclining, setIsDeclining] = useState(false)

    const handleClick = () => {
        if (!notification.isRead) {
            onMarkAsRead(notification.id)
        }
    }

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

    const getNotificationIcon = () => {
        switch (notification.type) {
            case NotificationType.INVITE:
                return <WorkspacesIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            case NotificationType.WORKSPACE:
                return <WorkspacesIcon sx={{ fontSize: 40, color: 'info.main' }} />
            case NotificationType.FILE:
                return <InsertDriveFileIcon sx={{ fontSize: 40, color: 'success.main' }} />
            case NotificationType.SYSTEM:
                return <InfoIcon sx={{ fontSize: 40, color: 'text.secondary' }} />
            default:
                return <InfoIcon sx={{ fontSize: 40, color: 'text.secondary' }} />
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
        <Stack
            direction="row"
            spacing={1.5}
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
                borderColor: 'divider'
            }}
        >
            {/* Notification Icon or Avatar */}
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

            {/* Content */}
            <Box flex={1}>
                <Typography variant="body2">
                    <Box component="span" sx={{ fontWeight: 600 }}>
                        {notification.title}
                    </Box>
                </Typography>

                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                    {notification.body}
                    {getActionIcon()}
                </Typography>

                {/* Action Buttons for Invite */}
                {notification.type === NotificationType.INVITE && !notification.isRead && (
                    <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
                        <Button
                            variant="contained"
                            size="small"
                            onClick={handleAcceptInvite}
                            disabled={isAccepting || isDeclining}
                            sx={{ minWidth: 100 }}
                        >
                            {isAccepting ? <CircularProgress size={16} /> : 'Join Workspace'}
                        </Button>
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={handleDeclineInvite}
                            disabled={isAccepting || isDeclining}
                        >
                            {isDeclining ? <CircularProgress size={16} /> : 'Decline'}
                        </Button>
                    </Stack>
                )}

                <TimeAgoComponent value={notification.createdAt} />
            </Box>

            {/* Unread Indicator */}
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
        </Stack>
    )
}
