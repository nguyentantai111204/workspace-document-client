import { io, Socket } from 'socket.io-client'
import { Message, Attachment } from '../../apis/chat/chat.interface'

interface SendMessageCallback {
    success: boolean
    message?: Message
    error?: string
}

interface JoinConversationCallback {
    success: boolean
    error?: string
}

interface MessageReadData {
    messageId: string
    userId: string
    readAt: string
}

interface TypingData {
    conversationId: string
    userId: string
}

interface UserStatusData {
    userId: string
    lastSeenAt?: string
}

class ChatSocketService {
    private socket: Socket | null = null
    private readonly namespace = '/chat'
    private heartbeatInterval: ReturnType<typeof setInterval> | null = null
    private readonly HEARTBEAT_INTERVAL = 30000 // 30s

    connect(token: string) {
        if (this.socket?.connected) {
            console.log('[Chat Socket] Already connected')
            return
        }

        const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

        console.log('[Chat Socket] Connecting to:', `${BACKEND_URL}${this.namespace}`)

        this.socket = io(`${BACKEND_URL}${this.namespace}`, {
            auth: { token },
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: 5
        })

        this.socket.on('connect', () => {
            console.log('[Chat Socket] Connected successfully')
            this.startHeartbeat()
        })

        this.socket.on('disconnect', (reason) => {
            console.log('[Chat Socket] Disconnected:', reason)
            this.stopHeartbeat()
        })

        this.socket.on('connect_error', (error) => {
            console.error('[Chat Socket] Connection error:', error)
        })
    }

    disconnect() {
        if (this.socket) {
            console.log('[Chat Socket] Disconnecting')
            this.stopHeartbeat()
            this.socket.disconnect()
            this.socket = null
        }
    }

    private startHeartbeat() {
        this.stopHeartbeat() // Ensure no existing interval
        console.log('[Chat Socket] Starting heartbeat')
        // Initial heartbeat
        this.socket?.emit('heartbeat')

        this.heartbeatInterval = setInterval(() => {
            if (this.socket?.connected) {
                this.socket.emit('heartbeat')
            }
        }, this.HEARTBEAT_INTERVAL)
    }

    private stopHeartbeat() {
        if (this.heartbeatInterval) {
            console.log('[Chat Socket] Stopping heartbeat')
            clearInterval(this.heartbeatInterval)
            this.heartbeatInterval = null
        }
    }

    // ==================== Room Management ====================

    joinConversation(
        conversationId: string,
        callback?: (response: JoinConversationCallback) => void
    ) {
        if (!this.socket) {
            console.error('[Chat Socket] Not connected')
            return
        }
        console.log('[Chat Socket] Joining conversation:', conversationId)
        this.socket.emit('join-conversation', { conversationId }, callback)
    }

    leaveConversation(conversationId: string) {
        if (!this.socket) return
        console.log('[Chat Socket] Leaving conversation:', conversationId)
        this.socket.emit('leave-conversation', { conversationId })
    }

    // ==================== Messaging ====================

    sendMessage(
        conversationId: string,
        content: string,
        attachments: Attachment[] = [],
        callback?: (response: SendMessageCallback) => void
    ) {
        if (!this.socket) {
            console.error('[Chat Socket] Not connected')
            callback?.({ success: false, error: 'Not connected' })
            return
        }

        this.socket.emit('send-message', {
            conversationId,
            content,
            attachments
        }, callback)
    }

    // ==================== Typing Indicators ====================

    startTyping(conversationId: string) {
        if (!this.socket) return
        this.socket.emit('typing-start', { conversationId })
    }

    stopTyping(conversationId: string) {
        if (!this.socket) return
        this.socket.emit('typing-stop', { conversationId })
    }

    // ==================== Read Receipts ====================

    markAsRead(messageId: string, callback?: () => void) {
        if (!this.socket) return
        this.socket.emit('mark-read', { messageId }, callback)
    }

    // ==================== Event Listeners ====================

    onNewMessage(callback: (message: Message) => void) {
        this.socket?.on('new-message', callback)
    }

    onMessageRead(callback: (data: MessageReadData) => void) {
        this.socket?.on('message-read', callback)
    }

    onUserTyping(callback: (data: TypingData) => void) {
        this.socket?.on('user-typing', callback)
    }

    onUserStopTyping(callback: (data: TypingData) => void) {
        this.socket?.on('user-stop-typing', callback)
    }

    onUserOnline(callback: (data: UserStatusData) => void) {
        this.socket?.on('user-online', callback)
    }

    onUserOffline(callback: (data: UserStatusData) => void) {
        this.socket?.on('user-offline', callback)
    }

    onConnect(callback: () => void) {
        this.socket?.on('connect', callback)
    }

    // ==================== Remove Listeners ====================

    off(event: string, callback?: (...args: any[]) => void) {
        if (callback) {
            this.socket?.off(event, callback)
        } else {
            this.socket?.off(event)
        }
    }

    // ==================== Status ====================

    isConnected(): boolean {
        return this.socket?.connected || false
    }

    getSocket(): Socket | null {
        return this.socket
    }
}

export const chatSocketService = new ChatSocketService()
