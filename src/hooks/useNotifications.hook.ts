import { useCallback, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../redux/store.redux'
import {
    addNotification,
    appendNotifications,
    incrementPage,
    markAllAsRead as markAllAsReadAction,
    markAsRead as markAsReadAction,
    resetNotifications,
    setLoading,
    setNotifications,
    setUnreadCount
} from '../redux/notification/notification.slice'
import {
    listNotificationsApi,
    markAllAsReadApi,
    markAsReadApi
} from '../apis/notification/notification.api'
import { socketService } from '../common/services/socket.service'
import { Notification } from '../apis/notification/notification.interface'
import { acceptInviteApi } from '../apis/workspace/workspace.api'

export const useNotifications = () => {
    const dispatch = useAppDispatch()
    const { notifications, unreadCount, page, limit, hasMore, loading } = useAppSelector(state => state.notification)
    const token = useAppSelector(state => state.account.token)
    const [error, setError] = useState<string | null>(null)

    // Fetch notifications
    const fetchNotifications = useCallback(async (pageNum: number = 1) => {
        try {
            dispatch(setLoading(true))
            const response = await listNotificationsApi({ page: pageNum, limit })

            if (pageNum === 1) {
                dispatch(setNotifications({
                    notifications: response.data,
                    total: response.meta.total,
                    unreadCount: response.unreadCount
                }))
            } else {
                dispatch(appendNotifications({
                    notifications: response.data,
                    total: response.meta.total
                }))
            }
        } catch (err) {
            setError('Failed to load notifications')
            console.error('Failed to fetch notifications:', err)
            dispatch(setLoading(false))
        }
    }, [dispatch, limit])

    // Mark as read
    const markAsRead = useCallback(async (id: string) => {
        try {
            await markAsReadApi(id)
            dispatch(markAsReadAction(id))
        } catch (err) {
            console.error('Failed to mark as read:', err)
        }
    }, [dispatch])

    // Mark all as read
    const markAllAsRead = useCallback(async () => {
        try {
            await markAllAsReadApi()
            dispatch(markAllAsReadAction())
        } catch (err) {
            console.error('Failed to mark all as read:', err)
        }
    }, [dispatch])

    // Load more notifications
    const loadMore = useCallback(async () => {
        if (!hasMore || loading) return

        const nextPage = page + 1
        dispatch(incrementPage())
        await fetchNotifications(nextPage)
    }, [hasMore, loading, page, dispatch, fetchNotifications])

    // Accept invite
    const acceptInvite = useCallback(async (inviteToken: string, notificationId: string): Promise<{ workspaceId: string } | undefined> => {
        try {
            const response = await acceptInviteApi({ token: inviteToken })
            await markAsRead(notificationId)
            return response
        } catch (err) {
            console.error('Failed to accept invite:', err)
            return undefined
        }
    }, [markAsRead])

    // Decline invite (just mark as read)
    const declineInvite = useCallback(async (notificationId: string) => {
        await markAsRead(notificationId)
    }, [markAsRead])

    // Socket event handlers
    useEffect(() => {
        if (!token) return

        const handleNewNotification = (notification: Notification) => {
            console.log('[Notification] New notification received:', notification)
            dispatch(addNotification(notification))
        }

        const handleUnreadCountUpdate = (data: { unreadCount: number }) => {
            console.log('[Notification] Unread count updated:', data.unreadCount)
            dispatch(setUnreadCount(data.unreadCount))
        }

        // Connect socket
        socketService.connect(token)

        // Register listeners
        socketService.onNewNotification(handleNewNotification)
        socketService.onUnreadCountUpdate(handleUnreadCountUpdate)

        // Fetch initial notifications
        fetchNotifications(1)

        return () => {
            // Cleanup listeners
            socketService.offNewNotification(handleNewNotification)
            socketService.offUnreadCountUpdate(handleUnreadCountUpdate)
        }
    }, [token, dispatch, fetchNotifications])

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            dispatch(resetNotifications())
        }
    }, [dispatch])

    return {
        notifications,
        unreadCount,
        hasMore,
        loading,
        error,
        markAsRead,
        markAllAsRead,
        loadMore,
        acceptInvite,
        declineInvite,
        refetch: () => fetchNotifications(1)
    }
}
