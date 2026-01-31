import {
    IconButton,
    Badge,
    Button,
    Box,
    Typography,
    CircularProgress,
    Pagination
} from '@mui/material'
import NotificationsIcon from '@mui/icons-material/Notifications'
import React, { useState, useEffect } from 'react'
import { BasePopoverComponent } from '../popover/base-popover.component'
import { NotificationItemComponent } from './notification-item.component'
import { useNotifications } from '../../hooks/use-notifications.hook'
import { useAppDispatch } from '../../redux/store.redux'
import { showSnackbar } from '../../redux/system/system.slice'

export const NotificationBellComponent = () => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
    const [hasLoadedOnce, setHasLoadedOnce] = useState(false)
    const dispatch = useAppDispatch()

    const {
        notifications,
        unreadCount,
        page,
        totalPages,
        loading,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        changePage,
        acceptInvite,
        declineInvite
    } = useNotifications()

    useEffect(() => {
        if (anchorEl && !hasLoadedOnce) {
            fetchNotifications()
            setHasLoadedOnce(true)
        }
    }, [anchorEl, hasLoadedOnce, fetchNotifications])

    const handleAcceptInvite = async (inviteToken: string, notificationId: string) => {
        try {
            const response = await acceptInvite(inviteToken, notificationId)
            dispatch(showSnackbar({
                message: 'Đã tham gia workspace thành công!',
                severity: 'success'
            }))
            if (response?.workspaceId) {
                window.location.reload()
            }
        } catch (error) {
            dispatch(showSnackbar({
                message: 'Không thể chấp nhận lời mời',
                severity: 'error'
            }))
        }
    }

    const handleDeclineInvite = async (notificationId: string) => {
        try {
            await declineInvite(notificationId)
            dispatch(showSnackbar({
                message: 'Đã từ chối lời mời',
                severity: 'info'
            }))
        } catch (error) {
            dispatch(showSnackbar({
                message: 'Không thể từ chối lời mời',
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
                title="Thông báo"
                subTitle={
                    unreadCount > 0 ? (
                        <Button
                            size="small"
                            onClick={handleMarkAllAsRead}
                            sx={{ textTransform: 'none' }}
                        >
                            Đánh dấu tất cả đã đọc
                        </Button>
                    ) : undefined
                }
                footer={
                    totalPages > 1 ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 1 }}>
                            <Pagination
                                count={totalPages}
                                page={page}
                                onChange={(_event, newPage) => changePage(newPage)}
                                color="primary"
                                shape="rounded"
                                size="small"
                                siblingCount={0}
                                disabled={loading}
                            />
                        </Box>
                    ) : undefined
                }
            >
                {loading && notifications.length === 0 ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : notifications.length === 0 && hasLoadedOnce ? (
                    <Box sx={{ textAlign: 'center', py: 4, px: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                            Chưa có thông báo nào
                        </Typography>
                    </Box>
                ) : !hasLoadedOnce ? (
                    <Box sx={{ textAlign: 'center', py: 4, px: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                            Nhấp để tải thông báo
                        </Typography>
                    </Box>
                ) : (
                    <Box sx={{ height: 'auto', overflow: 'auto' }}>
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
