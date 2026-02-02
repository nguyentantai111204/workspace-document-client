import { useState, useCallback, useEffect } from 'react'
import useSWR from 'swr'
import {
    getMessagesApi,
    sendMessageApi,
    markMessageAsReadApi,
    markAllAsReadApi
} from '../apis/chat/chat.api'
import { Message, MessageQuery, SendMessageRequest } from '../apis/chat/chat.interface'

export const useMessages = (conversationId: string | null | undefined) => {
    const [cursor, setCursor] = useState<string | undefined>(undefined)
    const [allMessages, setAllMessages] = useState<Message[]>([])

    useEffect(() => {
        setCursor(undefined)
        setAllMessages([])
    }, [conversationId])

    const query: MessageQuery = {
        limit: 50,
        cursor
    }

    const key = conversationId
        ? [`/conversations/${conversationId}/messages`, query]
        : null

    const { data, error, isLoading, mutate } = useSWR(
        key,
        ([, q]: [string, MessageQuery | undefined]) =>
            getMessagesApi(conversationId!, q),
        {
            revalidateOnFocus: false,
            onSuccess: (data) => {
                const messagesList = data?.data || []
                if (cursor) {
                    setAllMessages(prev => [...messagesList, ...(prev || [])])
                } else {
                    setAllMessages(messagesList)
                }
            }
        }
    )

    const sendMessage = async (data: SendMessageRequest): Promise<Message> => {
        try {
            const message = await sendMessageApi(conversationId!, data)

            setAllMessages(prev => [...(prev || []), message])
            await mutate()

            return message
        } catch (error) {
            throw error
        }
    }

    const markAsRead = async (messageId: string) => {
        try {
            await markMessageAsReadApi(messageId)
            await mutate()
        } catch (error) {
            console.error('Failed to mark message as read:', error)
        }
    }

    const markAllAsRead = async () => {
        if (!conversationId) return

        try {
            await markAllAsReadApi(conversationId)
            await mutate()
        } catch (error) {
            console.error('Failed to mark all as read:', error)
        }
    }

    const loadMore = useCallback(() => {
        if (data?.hasMore && data?.nextCursor) {
            setCursor(data.nextCursor)
        }
    }, [data])

    const addMessage = useCallback((message: Message) => {
        setAllMessages(prev => {
            const safePrev = prev || []
            if (safePrev.some(m => m.id === message.id)) return safePrev
            return [...safePrev, message]
        })
    }, [])

    return {
        messages: allMessages,
        hasMore: data?.hasMore || false,
        isLoading,
        error,
        mutate,
        sendMessage,
        markAsRead,
        markAllAsRead,
        loadMore,
        addMessage
    }
}
