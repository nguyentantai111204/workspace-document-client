import { useCallback, useEffect, useRef } from 'react'
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

    // Keep latest dispatch in a ref so socket callbacks are always fresh without causing effect re-runs
    const dispatchRef = useRef(dispatch)
    useEffect(() => { dispatchRef.current = dispatch }, [dispatch])

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
            dispatch(setNotifications({
                notifications: response.data,
                total: response.meta.total,
            }))
        } catch (err) {
            console.error('Failed to fetch notifications:', err)
            dispatch(setLoading(false))
        }
    }, [dispatch])

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

    const acceptAppointment = useCallback(async (workspaceId: string, appointmentId: string, notificationId: string) => {
        try {
            const { acceptAppointmentApi } = await import('../apis/appointment/appointment.api')
            await acceptAppointmentApi(workspaceId, appointmentId)
            await markAsRead(notificationId)
            return true
        } catch (err) {
            console.error('Failed to accept appointment:', err)
            return false
        }
    }, [markAsRead])

    const declineAppointment = useCallback(async (workspaceId: string, appointmentId: string, notificationId: string) => {
        try {
            const { rejectAppointmentApi } = await import('../apis/appointment/appointment.api')
            await rejectAppointmentApi(workspaceId, appointmentId)
            await markAsRead(notificationId)
            return true
        } catch (err) {
            console.error('Failed to decline appointment:', err)
            return false
        }
    }, [markAsRead])

    useEffect(() => {
        if (!isAuthenticated) return

        socketService.connect()
        fetchUnreadCount()

        const handleNewNotification = (notification: any) => {
            console.log('[Notification] New notification received:', notification)
            dispatchRef.current(addNotification(notification))
        }

        const handleUnreadCountUpdate = (data: { unreadCount: number }) => {
            console.log('[Notification] Unread count updated:', data.unreadCount)
            dispatchRef.current(setUnreadCount(data.unreadCount))
        }

        socketService.onNewNotification(handleNewNotification)
        socketService.onUnreadCountUpdate(handleUnreadCountUpdate)

        return () => {
            socketService.offNewNotification(handleNewNotification)
            socketService.offUnreadCountUpdate(handleUnreadCountUpdate)
        }
    }, [isAuthenticated])

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
        declineInvite,
        acceptAppointment,
        declineAppointment
    }
}
