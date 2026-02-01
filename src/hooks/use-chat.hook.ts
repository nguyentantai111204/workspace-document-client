import { useEffect, useCallback, useState } from 'react'
import { useAppSelector } from '../redux/store.redux'
import { chatSocketService } from '../common/services/chat-socket.service'
import { Message } from '../apis/chat/chat.interface'

interface TypingUser {
    userId: string
    conversationId: string
}

interface OnlineUser {
    userId: string
    isOnline: boolean
    lastSeenAt?: string
}

export const useChat = () => {
    const token = useAppSelector(state => state.account?.token)
    const [typingUsers, setTypingUsers] = useState<TypingUser[]>([])
    const [onlineUsers, setOnlineUsers] = useState<Map<string, OnlineUser>>(new Map())
    const [isConnected, setIsConnected] = useState(false)

    // Kết nối socket

    useEffect(() => {
        if (!token) return

        console.log('[useChat] Connecting to chat socket')
        chatSocketService.connect(token)
        setIsConnected(chatSocketService.isConnected())

        const checkConnection = setInterval(() => {
            setIsConnected(chatSocketService.isConnected())
        }, 1000)

        return () => {
            clearInterval(checkConnection)
            console.log('[useChat] Cleanup - not disconnecting socket (shared)')
        }
    }, [token])

    // Xử lý sự kiện

    const handleUserTyping = useCallback((data: { conversationId: string; userId: string }) => {
        setTypingUsers(prev => {
            const exists = prev.some(
                u => u.userId === data.userId && u.conversationId === data.conversationId
            )
            if (exists) return prev
            return [...prev, data]
        })
    }, [])

    const handleUserStopTyping = useCallback((data: { conversationId: string; userId: string }) => {
        setTypingUsers(prev =>
            prev.filter(u => !(u.userId === data.userId && u.conversationId === data.conversationId))
        )
    }, [])

    const handleUserOnline = useCallback((data: { userId: string }) => {
        setOnlineUsers(prev => {
            const newMap = new Map(prev)
            newMap.set(data.userId, { userId: data.userId, isOnline: true })
            return newMap
        })
    }, [])

    const handleUserOffline = useCallback((data: { userId: string; lastSeenAt?: string }) => {
        setOnlineUsers(prev => {
            const newMap = new Map(prev)
            newMap.set(data.userId, {
                userId: data.userId,
                isOnline: false,
                lastSeenAt: data.lastSeenAt
            })
            return newMap
        })
    }, [])

    useEffect(() => {
        if (!isConnected) return

        chatSocketService.onUserTyping(handleUserTyping)
        chatSocketService.onUserStopTyping(handleUserStopTyping)
        chatSocketService.onUserOnline(handleUserOnline)
        chatSocketService.onUserOffline(handleUserOffline)

        return () => {
            chatSocketService.off('user-typing', handleUserTyping)
            chatSocketService.off('user-stop-typing', handleUserStopTyping)
            chatSocketService.off('user-online', handleUserOnline)
            chatSocketService.off('user-offline', handleUserOffline)
        }
    }, [isConnected, handleUserTyping, handleUserStopTyping, handleUserOnline, handleUserOffline])

    const joinConversation = useCallback((conversationId: string) => {
        chatSocketService.joinConversation(conversationId, (response) => {
            if (response.success) {
                console.log('[useChat] Joined conversation:', conversationId)
            } else {
                console.error('[useChat] Failed to join conversation:', response)
            }
        })
    }, [])

    const leaveConversation = useCallback((conversationId: string) => {
        chatSocketService.leaveConversation(conversationId)
        console.log('[useChat] Left conversation:', conversationId)
    }, [])

    const sendMessage = useCallback((
        conversationId: string,
        content: string,
        attachments: any[] = [],
        callback?: (response: any) => void
    ) => {
        chatSocketService.sendMessage(conversationId, content, attachments, callback)
    }, [])

    const startTyping = useCallback((conversationId: string) => {
        chatSocketService.startTyping(conversationId)
    }, [])

    const stopTyping = useCallback((conversationId: string) => {
        chatSocketService.stopTyping(conversationId)
    }, [])

    const markAsRead = useCallback((messageId: string) => {
        chatSocketService.markAsRead(messageId)
    }, [])

    const onNewMessage = useCallback((callback: (message: Message) => void) => {
        chatSocketService.onNewMessage(callback)
        return () => chatSocketService.off('new-message', callback)
    }, [])

    const onMessageRead = useCallback((callback: (data: any) => void) => {
        chatSocketService.onMessageRead(callback)
        return () => chatSocketService.off('message-read', callback)
    }, [])

    const onConnect = useCallback((callback: () => void) => {
        chatSocketService.onConnect(callback)
        return () => chatSocketService.off('connect', callback)
    }, [])

    const isUserTyping = useCallback((conversationId: string, userId: string): boolean => {
        return typingUsers.some(
            u => u.conversationId === conversationId && u.userId === userId
        )
    }, [typingUsers])

    const getTypingUsers = useCallback((conversationId: string): string[] => {
        return typingUsers
            .filter(u => u.conversationId === conversationId)
            .map(u => u.userId)
    }, [typingUsers])

    const isUserOnline = useCallback((userId: string): boolean => {
        return onlineUsers.get(userId)?.isOnline || false
    }, [onlineUsers])

    const getUserLastSeen = useCallback((userId: string): string | undefined => {
        return onlineUsers.get(userId)?.lastSeenAt
    }, [onlineUsers])

    return {
        isConnected,
        joinConversation,
        leaveConversation,
        sendMessage,
        startTyping,
        stopTyping,
        markAsRead,
        onNewMessage,
        onMessageRead,
        onConnect,
        isUserTyping,
        getTypingUsers,
        isUserOnline,
        getUserLastSeen,
        typingUsers,
        onlineUsers
    }
}
