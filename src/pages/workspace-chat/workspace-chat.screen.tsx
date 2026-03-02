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
import { syncMessagesApi, getParticipantsApi } from '../../apis/chat/chat.api'
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

    const {
        messages,
        hasMore,
        isLoading: messagesLoading,
        loadMore,
        addMessage,
        markAsRead,
        markAllAsRead
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

        joinConversation(conversation.id)
        fetchOnlineUsers(conversation.id)
    }, [selectedConversation, leaveConversation, joinConversation, isMobile, fetchOnlineUsers])

    const handleBackToConversations = useCallback(() => {
        setShowConversationList(true)
        setSelectedConversation(null)
    }, [])

    const handleSendMessage = useCallback(async (content: string, attachments: any[]) => {
        if (!selectedConversation) return
        sendSocketMessage(selectedConversation.id, content, attachments, (response) => {
            if (response.success && response.message) {
                addMessage(response.message)
            }
        })
    }, [selectedConversation, sendSocketMessage, addMessage])

    useEffect(() => {
        if (!isConnected) return
        const cleanup = onNewMessage((message) => {
            if (selectedConversation && message.conversationId === selectedConversation.id) {
                addMessage(message)
                markAsRead(message.id)
            }
            mutateConversations()
        })
        return cleanup
    }, [isConnected, onNewMessage, selectedConversation, addMessage, markAsRead, mutateConversations])

    useEffect(() => {
        if (selectedConversation && isConnected) {
            fetchOnlineUsers(selectedConversation.id)
        }
    }, [selectedConversation, isConnected, fetchOnlineUsers])

    useEffect(() => {
        if (selectedConversation && selectedConversation.unreadCount > 0) {
            markAllAsRead()
        }
    }, [selectedConversation?.id, selectedConversation?.unreadCount])

    const { members } = useWorkspaceMembers(currentWorkspace?.id, { limit: 100 })

    const getUserName = useCallback((userId: string) => {
        const member = members.find(m => m.userId === userId)
        return member?.fullName || member?.email || 'Người dùng ẩn danh'
    }, [members])

    const getConversationTitle = useCallback((conversation: ConversationWithUnread) => {
        // Ưu tiên dùng tên cuộc trò chuyện nếu đã được đặt
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
                        conversations={conversations}
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
                    conversations={conversations}
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
