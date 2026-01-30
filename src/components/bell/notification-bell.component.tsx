import {
    IconButton,
    Badge,
    Button,
    Box,
    Typography,
    CircularProgress
} from '@mui/material'
import NotificationsIcon from '@mui/icons-material/Notifications'
import React, { useState } from 'react'
import { BasePopoverComponent } from '../popover/base-popover.component'
import { NotificationItemComponent } from './notification-item.component'
import { useNotifications } from '../../hooks/useNotifications.hook'
import { useAppDispatch } from '../../redux/store.redux'
import { showSnackbar } from '../../redux/system/system.slice'

export const NotificationBellComponent = () => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
    const dispatch = useAppDispatch()

    const {
        notifications,
        unreadCount,
        hasMore,
        loading,
        markAsRead,
        markAllAsRead,
        loadMore,
        acceptInvite,
        declineInvite
    } = useNotifications()

    const handleAcceptInvite = async (inviteToken: string, notificationId: string) => {
        try {
            const response = await acceptInvite(inviteToken, notificationId)
            dispatch(showSnackbar({
                message: 'Successfully joined workspace!',
                severity: 'success'
            }))
            // Optionally refresh workspace list
            if (response?.workspaceId) {
                // You can dispatch an action to refresh workspaces here
                window.location.reload() // Simple approach for now
            }
        } catch (error) {
            dispatch(showSnackbar({
                message: 'Failed to accept invite',
                severity: 'error'
            }))
        }
    }

    const handleDeclineInvite = async (notificationId: string) => {
        try {
            await declineInvite(notificationId)
            dispatch(showSnackbar({
                message: 'Invite declined',
                severity: 'info'
            }))
        } catch (error) {
            dispatch(showSnackbar({
                message: 'Failed to decline invite',
                severity: 'error'
            }))
        }
    }

    const handleMarkAllAsRead = async () => {
        await markAllAsRead()
    }

    return (
        <React.Fragment>
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                <Badge badgeContent={unreadCount} color="error">
                    <NotificationsIcon />
                </Badge>
            </IconButton>

            <BasePopoverComponent
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
                title="Notifications"
                subTitle={
                    unreadCount > 0 ? (
                        <Button
                            size="small"
                            onClick={handleMarkAllAsRead}
                            sx={{ textTransform: 'none' }}
                        >
                            Mark all as read
                        </Button>
                    ) : undefined
                }
                footer={
                    hasMore ? (
                        <Button
                            fullWidth
                            onClick={loadMore}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={20} /> : 'Load more'}
                        </Button>
                    ) : undefined
                }
            >
                {loading && notifications.length === 0 ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : notifications.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 4, px: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                            No notifications yet
                        </Typography>
                    </Box>
                ) : (
                    <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                        {notifications.map((notification) => (
                            <NotificationItemComponent
                                key={notification.id}
                                notification={notification}
                                onMarkAsRead={markAsRead}
                                onAcceptInvite={handleAcceptInvite}
                                onDeclineInvite={handleDeclineInvite}
                            />
                        ))}
                    </Box>
                )}
            </BasePopoverComponent>
        </React.Fragment>
    )
}
