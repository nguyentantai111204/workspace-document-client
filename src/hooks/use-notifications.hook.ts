import { useCallback, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../redux/store.redux'
import {
    setNotifications,
    addNotification,
    setUnreadCount,
    markAsRead as markAsReadAction,
    markAllAsRead as markAllAsReadAction,
    setLoading,
    setPage
} from '../redux/notification/notification.slice'
import {
    listNotificationsApi,
    getUnreadCountApi,
    markAsReadApi,
    markAllAsReadApi
} from '../apis/notification/notification.api'
import { acceptInviteApi } from '../apis/workspace/workspace.api'
import { socketService } from '../common/services/socket.service'
import { PAGE_LIMIT_DEFAULT } from '../common/constant/page-take.constant'

export const useNotifications = () => {
    const dispatch = useAppDispatch()
    const { notifications, unreadCount, page, total, totalPages, loading } = useAppSelector(state => state.notification)
    const isAuthenticated = useAppSelector(state => state.account?.isAuthenticated)

    const fetchUnreadCount = useCallback(async () => {
        try {
            const response = await getUnreadCountApi()
            dispatch(setUnreadCount(response))
        } catch (err) {
            console.error('Failed to fetch unread count:', err)
        }
    }, [dispatch])

    const fetchNotifications = useCallback(async (pageNum: number = 1) => {
        try {
            dispatch(setLoading(true))
            const response = await listNotificationsApi({ page: pageNum, limit: PAGE_LIMIT_DEFAULT.limit })
            console.log('[Notification Hook] Fetched notifications:', response)

            console.log('[Notification Hook] Setting notifications:', {
                notifications: response.data,
                total: response.meta.total
            })
            dispatch(setNotifications({
                notifications: response.data,
                total: response.meta.total,
                unreadCount: unreadCount // Keep existing unread count
            }))
        } catch (err) {
            console.error('Failed to fetch notifications:', err)
            dispatch(setLoading(false))
        }
    }, [dispatch, unreadCount])

    // Mark as read
    const markAsRead = useCallback(async (id: string) => {
        try {
            await markAsReadApi(id)
            dispatch(markAsReadAction(id))
        } catch (err) {
            console.error('Failed to mark as read:', err)
        }
    }, [dispatch])

    const markAllAsRead = useCallback(async () => {
        try {
            await markAllAsReadApi()
            dispatch(markAllAsReadAction())
        } catch (err) {
            console.error('Failed to mark all as read:', err)
        }
    }, [dispatch])

    const changePage = useCallback((newPage: number) => {
        dispatch(setPage(newPage))
        fetchNotifications(newPage)
    }, [dispatch, fetchNotifications])

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

    const declineInvite = useCallback(async (notificationId: string) => {
        await markAsRead(notificationId)
    }, [markAsRead])

    const handleNewNotification = useCallback((notification: any) => {
        console.log('[Notification] New notification received:', notification)
        dispatch(addNotification(notification))
    }, [dispatch])

    const handleUnreadCountUpdate = useCallback((data: { unreadCount: number }) => {
        console.log('[Notification] Unread count updated:', data.unreadCount)
        dispatch(setUnreadCount(data.unreadCount))
    }, [dispatch])

    useEffect(() => {
        if (!isAuthenticated) return

        socketService.connect()

        socketService.onNewNotification(handleNewNotification)
        socketService.onUnreadCountUpdate(handleUnreadCountUpdate)

        fetchUnreadCount()

        return () => {
            socketService.offNewNotification(handleNewNotification)
            socketService.offUnreadCountUpdate(handleUnreadCountUpdate)
        }
    }, [isAuthenticated, handleNewNotification, handleUnreadCountUpdate, fetchUnreadCount])

    return {
        notifications,
        unreadCount,
        page,
        total,
        totalPages,
        loading,
        fetchNotifications,
        fetchUnreadCount,
        markAsRead,
        markAllAsRead,
        changePage,
        acceptInvite,
        declineInvite
    }
}
