import { useState, useCallback } from 'react'
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
                // Prepend older messages when loading more
                if (cursor) {
                    setAllMessages(prev => [...data.messages, ...prev])
                } else {
                    setAllMessages(data.messages)
                }
            }
        }
    )

    const sendMessage = async (data: SendMessageRequest): Promise<Message> => {
        try {
            const message = await sendMessageApi(conversationId!, data)

            // Optimistic update: add message to list
            setAllMessages(prev => [...prev, message])
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
        setAllMessages(prev => [...prev, message])
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
