import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Notification } from '../../apis/notification/notification.interface'

export interface NotificationState {
    notifications: Notification[]
    unreadCount: number
    page: number
    limit: number
    hasMore: boolean
    loading: boolean
}

const initialState: NotificationState = {
    notifications: [],
    unreadCount: 0,
    page: 1,
    limit: 20,
    hasMore: true,
    loading: false
}

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        setNotifications: (state, action: PayloadAction<{ notifications: Notification[], total: number, unreadCount: number }>) => {
            state.notifications = action.payload.notifications
            state.unreadCount = action.payload.unreadCount
            state.hasMore = action.payload.notifications.length < action.payload.total
            state.loading = false
        },
        appendNotifications: (state, action: PayloadAction<{ notifications: Notification[], total: number }>) => {
            state.notifications = [...state.notifications, ...action.payload.notifications]
            state.hasMore = state.notifications.length < action.payload.total
            state.loading = false
        },
        addNotification: (state, action: PayloadAction<Notification>) => {
            // Add to beginning of list
            state.notifications = [action.payload, ...state.notifications]
            if (!action.payload.isRead) {
                state.unreadCount += 1
            }
        },
        setUnreadCount: (state, action: PayloadAction<number>) => {
            state.unreadCount = action.payload
        },
        markAsRead: (state, action: PayloadAction<string>) => {
            const notification = state.notifications.find(n => n.id === action.payload)
            if (notification && !notification.isRead) {
                notification.isRead = true
                state.unreadCount = Math.max(0, state.unreadCount - 1)
            }
        },
        markAllAsRead: (state) => {
            state.notifications.forEach(n => {
                n.isRead = true
            })
            state.unreadCount = 0
        },
        incrementPage: (state) => {
            state.page += 1
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload
        },
        resetNotifications: (state) => {
            state.notifications = []
            state.page = 1
            state.hasMore = true
            state.unreadCount = 0
        }
    }
})

export const {
    setNotifications,
    appendNotifications,
    addNotification,
    setUnreadCount,
    markAsRead,
    markAllAsRead,
    incrementPage,
    setLoading,
    resetNotifications
} = notificationSlice.actions

export default notificationSlice.reducer
