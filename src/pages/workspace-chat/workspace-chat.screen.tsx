import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { Box, useTheme, useMediaQuery, Typography } from '@mui/material'
import { useWorkspace } from '../../contexts/workspace.context'
import { useConversations } from '../../hooks/use-conversations.hook'
import { useMessages } from '../../hooks/use-messages.hook'
import { useChat } from '../../hooks/use-chat.hook'
import { useWorkspaceMembers } from '../../hooks/use-workspace-member.hook'
import { useDebounce } from '../../hooks/use-debounce.hook'
import { ConversationList } from './components/conversation-list.component'
import { MessageList } from './components/message-list.component'
import { MessageInput } from './components/message-input.component'
import { CreateConversationDialog } from './components/create-conversation-dialog.component'
import { ChatHeader } from './components/chat-header.component'
import { ConversationWithUnread } from '../../apis/chat/chat.interface'
import { syncMessagesApi, getParticipantsApi, markAllAsReadApi } from '../../apis/chat/chat.api'
import { PAGE_LIMIT_DEFAULT } from '../../common/constant/page-take.constant'
import { useAppSelector } from '../../redux/store.redux'
import { StackColumn, StackRowAlignCenterJustCenter } from '../../components/mui-custom/stack/stack.mui-custom'

export const WorkspaceChatPage = () => {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))
    const { currentWorkspace } = useWorkspace()
    const currentUserId = useAppSelector(state => state.account?.user?.id)

    const [selectedConversation, setSelectedConversation] = useState<ConversationWithUnread | null>(null)
    const [showConversationList, setShowConversationList] = useState(true)
    const [createDialogOpen, setCreateDialogOpen] = useState(false)
    const [search, setSearch] = useState('')
    const debouncedSearch = useDebounce(search, 300)

    const { conversations, isLoading: conversationsLoading, mutate: mutateConversations } = useConversations(
        currentWorkspace?.id,
        { page: 1, limit: PAGE_LIMIT_DEFAULT.limit, search: debouncedSearch }
    )

    // unreadCount tách riêng khỏi SWR cache → tránh race condition khi nhiều tin đến nhanh
    const [unreadMap, setUnreadMap] = useState<Map<string, number>>(new Map())

    // Khi server trả về conversations (load lần đầu hoặc search), đồng bộ unreadMap
    useEffect(() => {
        setUnreadMap(prev => {
            const next = new Map(prev)
            conversations.forEach(conv => {
                // Chỉ set nếu chưa có trong local → tránh ghi đè optimistic count
                if (!next.has(conv.id)) {
                    next.set(conv.id, conv.unreadCount ?? 0)
                }
            })
            return next
        })
    }, [conversations])

    // Merge unreadMap vào conversations để pass xuống UI
    const conversationsWithUnread = useMemo(() =>
        conversations.map(c => ({
            ...c,
            unreadCount: unreadMap.get(c.id) ?? c.unreadCount ?? 0
        })),
        [conversations, unreadMap]
    )

    const {
        messages,
        hasMore,
        isLoading: messagesLoading,
        loadMore,
        addMessage,
        markAsRead
    } = useMessages(selectedConversation?.id)

    const {
        isConnected,
        joinConversation,
        leaveConversation,
        sendMessage: sendSocketMessage,
        startTyping,
        stopTyping,
        onNewMessage,
        getTypingUsers,
        onConnect,
        fetchOnlineUsers,
        isUserOnline
    } = useChat()

    const messagesRef = useRef(messages)
    useEffect(() => {
        messagesRef.current = messages
    }, [messages])

    const joinedRoomsRef = useRef<Set<string>>(new Set())

    useEffect(() => {
        if (!isConnected || conversations.length === 0) return
        conversations.forEach(conv => {
            if (!joinedRoomsRef.current.has(conv.id)) {
                joinConversation(conv.id)
                joinedRoomsRef.current.add(conv.id)
            }
        })
    }, [isConnected, conversations, joinConversation])

    // Reset khi mất kết nối → re-join khi connect lại
    useEffect(() => {
        if (!isConnected) {
            joinedRoomsRef.current.clear()
        }
    }, [isConnected])

    useEffect(() => {
        const cleanup = onConnect(async () => {
            if (!selectedConversation) return
            const lastMessage = messagesRef.current[messagesRef.current.length - 1]
            if (!lastMessage) return
            try {
                const synced = await syncMessagesApi(selectedConversation.id, lastMessage.id)
                synced.forEach(msg => addMessage(msg))
            } catch (error) {
                console.error('[WorkspaceChatPage] Failed to sync messages:', error)
            }
        })
        return cleanup
    }, [onConnect, selectedConversation, addMessage])

    const handleSelectConversation = useCallback(async (conversation: ConversationWithUnread) => {
        if (selectedConversation) {
            leaveConversation(selectedConversation.id)
        }

        let conv = conversation
        if (!conversation.participants || conversation.participants.length === 0) {
            const participants = await getParticipantsApi(conversation.id)
            conv = { ...conversation, participants }
        }

        setSelectedConversation(conv)

        if (isMobile) {
            setShowConversationList(false)
        }

        // Optimistic: reset unread ngay lập tức
        if ((unreadMap.get(conversation.id) ?? 0) > 0) {
            setUnreadMap(prev => {
                const next = new Map(prev)
                next.set(conversation.id, 0)
                return next
            })
            markAllAsReadApi(conversation.id).catch(console.error)
        }

        joinConversation(conversation.id)
        fetchOnlineUsers(conversation.id)
    }, [selectedConversation, leaveConversation, joinConversation, isMobile, fetchOnlineUsers, unreadMap])

    const handleBackToConversations = useCallback(() => {
        setShowConversationList(true)
        setSelectedConversation(null)
    }, [])

    const handleSendMessage = useCallback(async (content: string, attachments: any[]) => {
        if (!selectedConversation) return
        sendSocketMessage(selectedConversation.id, content, attachments, (response) => {
            if (response.success && response.message) {
                const message = response.message
                addMessage(message)

                // Cập nhật conversation list ngay sau khi gửi thành công
                mutateConversations(
                    (current) => {
                        if (!current) return current
                        const updated = current.data?.map((c: ConversationWithUnread) => {
                            if (c.id !== selectedConversation.id) return c
                            return {
                                ...c,
                                lastMessage: message,
                                lastMessageAt: message.createdAt,
                                unreadCount: 0
                            }
                        })
                        const sorted = [...(updated ?? [])].sort((a, b) =>
                            new Date(b.lastMessageAt ?? 0).getTime() -
                            new Date(a.lastMessageAt ?? 0).getTime()
                        )
                        return { ...current, data: sorted }
                    },
                    false
                )
            }
        })
    }, [selectedConversation, sendSocketMessage, addMessage, mutateConversations])

    useEffect(() => {
        if (!isConnected) return
        const cleanup = onNewMessage((message) => {
            const isActiveConversation = selectedConversation?.id === message.conversationId

            // Cập nhật lastMessage + sort trong SWR cache (không đụng unreadCount)
            mutateConversations(
                (current) => {
                    if (!current) return current
                    const updated = current.data?.map((c: ConversationWithUnread) => {
                        if (c.id !== message.conversationId) return c
                        return { ...c, lastMessage: message, lastMessageAt: message.createdAt }
                    })
                    const sorted = [...(updated ?? [])].sort((a, b) =>
                        new Date(b.lastMessageAt ?? 0).getTime() -
                        new Date(a.lastMessageAt ?? 0).getTime()
                    )
                    return { ...current, data: sorted }
                },
                false
            )

            if (isActiveConversation) {
                addMessage(message)
                markAsRead(message.id)
            } else {
                // Tăng unread qua state riêng → atomic, không race condition
                setUnreadMap(prev => {
                    const next = new Map(prev)
                    next.set(message.conversationId, (next.get(message.conversationId) ?? 0) + 1)
                    return next
                })
            }
        })
        return cleanup
    }, [isConnected, onNewMessage, selectedConversation, addMessage, markAsRead, mutateConversations])

    useEffect(() => {
        if (selectedConversation && isConnected) {
            fetchOnlineUsers(selectedConversation.id)
        }
    }, [selectedConversation, isConnected, fetchOnlineUsers])


    const { members } = useWorkspaceMembers(currentWorkspace?.id, { limit: 100 })

    const getUserName = useCallback((userId: string) => {
        const member = members.find(m => m.userId === userId)
        return member?.fullName || member?.email || 'Người dùng ẩn danh'
    }, [members])

    const getConversationTitle = useCallback((conversation: ConversationWithUnread) => {
        if (conversation.name) {
            return conversation.name
        }

        if (conversation.participants && currentUserId) {
            const other = conversation.participants.find(p => p.userId !== currentUserId)
            if (other) return getUserName(other.userId)
        }

        return 'Tin nhắn trực tiếp'
    }, [currentUserId, getUserName])

    const typingUserNames = selectedConversation
        ? getTypingUsers(selectedConversation.id).map(getUserName)
        : []

    const isCurrentConversationOnline = useMemo(() => {
        if (!selectedConversation || !currentUserId) return false
        if (selectedConversation.type === 'DIRECT') {
            if (!selectedConversation.participants || selectedConversation.participants.length === 0) return false
            const other = selectedConversation.participants.find(p => p.userId !== currentUserId)
            if (other) return isUserOnline(other.userId)
        }
        return false
    }, [selectedConversation, currentUserId, isUserOnline])

    const getOtherUserLastReadAt = useCallback(() => {
        if (!selectedConversation || selectedConversation.type !== 'DIRECT' || !selectedConversation.participants) return undefined
        const other = selectedConversation.participants.find(p => p.userId !== currentUserId)
        return other?.lastReadAt
    }, [selectedConversation, currentUserId])

    const handleCreateConversation = () => setCreateDialogOpen(true)

    const handleConversationCreated = useCallback(async (conversationId: string) => {
        const updatedData = await mutateConversations()
        if (updatedData?.data) {
            const newConv = updatedData.data.find((c: ConversationWithUnread) => c.id === conversationId)
            if (newConv) handleSelectConversation(newConv)
        }
    }, [mutateConversations, handleSelectConversation])

    const handleSearchChange = useCallback((value: string) => {
        setSearch(value)
    }, [])

    const chatHeaderProps = (conv: ConversationWithUnread, extra?: { onBack?: () => void; isMobile?: boolean }) => ({
        conversation: { ...conv, name: getConversationTitle(conv) },
        isOnline: isCurrentConversationOnline,
        onInfoClick: () => console.log('Info clicked'),
        ...extra
    })

    if (!currentWorkspace) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography>Không tìm thấy workspace</Typography>
            </Box>
        )
    }

    if (isMobile) {
        return (
            <StackColumn sx={{ height: '100%' }}>
                {showConversationList ? (
                    <ConversationList
                        conversations={conversationsWithUnread}
                        activeConversationId={selectedConversation?.id}
                        onSelectConversation={handleSelectConversation}
                        onCreateConversation={handleCreateConversation}
                        isLoading={conversationsLoading}
                        onSearchChange={handleSearchChange}
                    />
                ) : (
                    <>
                        {selectedConversation && (
                            <ChatHeader {...chatHeaderProps(selectedConversation, {
                                onBack: handleBackToConversations,
                                isMobile: true
                            })} />
                        )}
                        <MessageList
                            messages={messages}
                            isLoading={messagesLoading}
                            hasMore={hasMore}
                            onLoadMore={loadMore}
                            typingUsers={typingUserNames}
                            lastReadAt={getOtherUserLastReadAt()}
                        />
                        <MessageInput
                            onSend={handleSendMessage}
                            onTyping={() => selectedConversation && startTyping(selectedConversation.id)}
                            onStopTyping={() => selectedConversation && stopTyping(selectedConversation.id)}
                        />
                    </>
                )}
                <CreateConversationDialog
                    open={createDialogOpen}
                    onClose={() => setCreateDialogOpen(false)}
                    onSuccess={handleConversationCreated}
                />
            </StackColumn>
        )
    }

    return (
        <Box sx={{ height: '100%', display: 'flex', bgcolor: 'background.default' }}>
            <Box sx={{ width: '350px', flexShrink: 0, borderRight: `1px solid ${theme.palette.divider}` }}>
                <ConversationList
                    conversations={conversationsWithUnread}
                    activeConversationId={selectedConversation?.id}
                    onSelectConversation={handleSelectConversation}
                    onCreateConversation={handleCreateConversation}
                    isLoading={conversationsLoading}
                    onSearchChange={handleSearchChange}
                />
            </Box>

            <StackColumn sx={{ flex: 1, overflow: 'hidden' }}>
                {selectedConversation ? (
                    <>
                        <ChatHeader {...chatHeaderProps(selectedConversation, { isMobile: false })} />
                        <MessageList
                            messages={messages}
                            isLoading={messagesLoading}
                            hasMore={hasMore}
                            onLoadMore={loadMore}
                            typingUsers={typingUserNames}
                            lastReadAt={getOtherUserLastReadAt()}
                        />
                        <MessageInput
                            onSend={handleSendMessage}
                            onTyping={() => startTyping(selectedConversation.id)}
                            onStopTyping={() => stopTyping(selectedConversation.id)}
                        />
                    </>
                ) : (
                    <StackRowAlignCenterJustCenter sx={{ flex: 1, color: 'text.secondary' }}>
                        Chọn một cuộc trò chuyện để bắt đầu
                    </StackRowAlignCenterJustCenter>
                )}
            </StackColumn>

            <CreateConversationDialog
                open={createDialogOpen}
                onClose={() => setCreateDialogOpen(false)}
                onSuccess={handleConversationCreated}
            />
        </Box>
    )
}
