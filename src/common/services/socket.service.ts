import { io, Socket } from 'socket.io-client'
import { Notification } from '../../apis/notification/notification.interface'

class SocketService {
    private socket: Socket | null = null
    private readonly namespace = '/notifications'

    connect(token: string) {
        if (this.socket?.connected) {
            return
        }

        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
        const baseUrl = apiUrl.replace('/api', '')

        this.socket = io(`${baseUrl}${this.namespace}`, {
            auth: {
                token
            },
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: 5
        })

        this.socket.on('connect', () => {
            console.log('[Socket] Connected to notification service')
        })

        this.socket.on('disconnect', (reason) => {
            console.log('[Socket] Disconnected:', reason)
        })

        this.socket.on('connect_error', (error) => {
            console.error('[Socket] Connection error:', error)
        })
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect()
            this.socket = null
        }
    }

    onNewNotification(callback: (notification: Notification) => void) {
        this.socket?.on('notification.new', callback)
    }

    onUnreadCountUpdate(callback: (data: { unreadCount: number }) => void) {
        this.socket?.on('notification.unreadCount', callback)
    }

    offNewNotification(callback?: (notification: Notification) => void) {
        if (callback) {
            this.socket?.off('notification.new', callback)
        } else {
            this.socket?.off('notification.new')
        }
    }

    offUnreadCountUpdate(callback?: (data: { unreadCount: number }) => void) {
        if (callback) {
            this.socket?.off('notification.unreadCount', callback)
        } else {
            this.socket?.off('notification.unreadCount')
        }
    }

    isConnected(): boolean {
        return this.socket?.connected || false
    }
}

export const socketService = new SocketService()
