import { useState, useEffect, useCallback, useRef } from 'react'
import { Box, useTheme, useMediaQuery } from '@mui/material'
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
import { syncMessagesApi } from '../../apis/chat/chat.api'
import { PAGE_LIMIT_DEFAULT } from '../../common/constant/page-take.constant'
import { useAppSelector } from '../../redux/store.redux'

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
        {
            page: 1,
            limit: PAGE_LIMIT_DEFAULT.limit,
            search: debouncedSearch
        }
    )

    const {
        messages,
        hasMore,
        isLoading: messagesLoading,
        loadMore,
        addMessage,
        markAsRead
    } = useMessages(selectedConversation?.id)

    console.log('WorkspaceChatPage messages:', messages.length, selectedConversation?.id)

    const {
        isConnected,
        joinConversation,
        leaveConversation,
        sendMessage: sendSocketMessage,
        startTyping,
        stopTyping,
        onNewMessage,
        getTypingUsers,
        onConnect
    } = useChat()

    const messagesRef = useRef(messages)
    useEffect(() => {
        messagesRef.current = messages
    }, [messages])

    // Sync messages on reconnect
    useEffect(() => {
        const cleanup = onConnect(async () => {
            console.log('[WorkspaceChatPage] Socket reconnected, syncing messages...')
            if (!selectedConversation) return

            const currentMessages = messagesRef.current
            const lastMessage = currentMessages[currentMessages.length - 1]

            if (!lastMessage) return

            try {
                const syncedMessages = await syncMessagesApi(selectedConversation.id, lastMessage.id)
                console.log(`[WorkspaceChatPage] Synced ${syncedMessages.length} messages`)

                if (syncedMessages.length > 0) {
                    syncedMessages.forEach(msg => addMessage(msg))
                }
            } catch (error) {
                console.error('[WorkspaceChatPage] Failed to sync messages:', error)
            }
        })

        return cleanup
    }, [onConnect, selectedConversation, addMessage])

    const handleSelectConversation = useCallback((conversation: ConversationWithUnread) => {
        if (selectedConversation) {
            leaveConversation(selectedConversation.id)
        }
        setSelectedConversation(conversation)

        if (isMobile) {
            setShowConversationList(false)
        }

        joinConversation(conversation.id)
    }, [selectedConversation, leaveConversation, joinConversation, isMobile])

    const handleBackToConversations = useCallback(() => {
        setShowConversationList(true)
        setSelectedConversation(null)
    }, [])

    // Handle message send
    const handleSendMessage = useCallback(async (content: string, attachments: any[]) => {
        if (!selectedConversation) return

        // Send via socket for real-time
        sendSocketMessage(selectedConversation.id, content, attachments, (response) => {
            if (response.success && response.message) {
                // Message will be added via socket event, but we add it here too
                // deduplication in addMessage will handle it
                console.log('Message sent successfully')
                addMessage(response.message)
            }
        })
    }, [selectedConversation, sendSocketMessage])

    // Listen to new messages
    useEffect(() => {
        if (!isConnected) return

        const cleanup = onNewMessage((message) => {
            console.log('New message received:', message)

            // Add message to current conversation if it matches
            if (selectedConversation && message.conversationId === selectedConversation.id) {
                addMessage(message)

                // Mark as read
                markAsRead(message.id)
            }

            // Refresh conversations list to update last message
            mutateConversations()
        })

        return cleanup
    }, [isConnected, onNewMessage, selectedConversation, addMessage, markAsRead, mutateConversations])

    const { members } = useWorkspaceMembers(currentWorkspace?.id, { limit: 100 })

    const getUserName = useCallback((userId: string) => {
        const member = members.find(m => m.userId === userId)
        return member?.fullName || member?.email || 'Người dùng ẩn danh'
    }, [members])

    const getConversationTitle = useCallback((conversation: ConversationWithUnread) => {
        if (conversation.type === 'GROUP' && conversation.name) {
            return conversation.name
        }

        // For Direct messages, try to find the other participant
        if (conversation.participants && currentUserId) {
            const otherParticipant = conversation.participants.find(p => p.userId !== currentUserId)
            if (otherParticipant) {
                return getUserName(otherParticipant.userId)
            }
        }

        return 'Tin nhắn trực tiếp'
    }, [currentUserId, getUserName])

    const typingUserNames = selectedConversation
        ? getTypingUsers(selectedConversation.id).map(getUserName)
        : []

    const handleCreateConversation = () => {
        setCreateDialogOpen(true)
    }

    const handleConversationCreated = useCallback(async (conversationId: string) => {
        const updatedData = await mutateConversations()

        if (updatedData?.data) {
            const newConv = updatedData.data.find((c: ConversationWithUnread) => c.id === conversationId)
            if (newConv) {
                handleSelectConversation(newConv)
            }
        }
    }, [mutateConversations, handleSelectConversation])

    const handleSearchChange = useCallback((value: string) => {
        setSearch(value)
    }, [])

    if (!currentWorkspace) {
        return (
            <Box sx={{ p: 3 }}>
                <p>Không tìm thấy workspace</p>
            </Box>
        )
    }

    if (isMobile) {
        return (
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
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
                            <ChatHeader
                                conversation={{
                                    ...selectedConversation,
                                    name: getConversationTitle(selectedConversation)
                                }}
                                onBack={handleBackToConversations}
                                isMobile={true}
                                onInfoClick={() => console.log('Info clicked')}
                            />
                        )}
                        <MessageList
                            messages={messages}
                            isLoading={messagesLoading}
                            hasMore={hasMore}
                            onLoadMore={loadMore}
                            typingUsers={typingUserNames}
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
            </Box>
        )
    }

    return (
        <Box
            sx={{
                height: '100%',
                display: 'flex',
                bgcolor: 'background.default'
            }}
        >
            <Box
                sx={{
                    width: '350px',
                    flexShrink: 0,
                    borderRight: `1px solid ${theme.palette.divider}`
                }}
            >
                <ConversationList
                    conversations={conversations}
                    activeConversationId={selectedConversation?.id}
                    onSelectConversation={handleSelectConversation}
                    onCreateConversation={handleCreateConversation}
                    isLoading={conversationsLoading}
                    onSearchChange={handleSearchChange}
                />
            </Box>

            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden'
                }}
            >
                {selectedConversation ? (
                    <>
                        <ChatHeader
                            conversation={{
                                ...selectedConversation,
                                name: getConversationTitle(selectedConversation)
                            }}
                            isMobile={false}
                            onInfoClick={() => console.log('Info clicked')}
                        />
                        <MessageList
                            messages={messages}
                            isLoading={messagesLoading}
                            hasMore={hasMore}
                            onLoadMore={loadMore}
                            typingUsers={typingUserNames}
                        />
                        <MessageInput
                            onSend={handleSendMessage}
                            onTyping={() => startTyping(selectedConversation.id)}
                            onStopTyping={() => stopTyping(selectedConversation.id)}
                        />
                    </>
                ) : (
                    <Box
                        sx={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'text.secondary'
                        }}
                    >
                        Chọn một cuộc trò chuyện để bắt đầu
                    </Box>
                )}
            </Box>

            <CreateConversationDialog
                open={createDialogOpen}
                onClose={() => setCreateDialogOpen(false)}
                onSuccess={handleConversationCreated}
            />
        </Box>
    )
}
