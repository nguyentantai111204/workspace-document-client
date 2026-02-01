import { useState, useEffect, useCallback } from 'react'
import { Box, useTheme, useMediaQuery } from '@mui/material'
import { useWorkspace } from '../../contexts/workspace.context'
import { useConversations } from '../../hooks/use-conversations.hook'
import { useMessages } from '../../hooks/use-messages.hook'
import { useChat } from '../../hooks/use-chat.hook'
import { ConversationList } from './components/conversation-list.component'
import { MessageList } from './components/message-list.component'
import { MessageInput } from './components/message-input.component'
import { CreateConversationDialog } from './components/create-conversation-dialog.component'
import { ConversationWithUnread } from '../../apis/chat/chat.interface'
import { PAGE_LIMIT_DEFAULT } from '../../common/constant/page-take.constant'

export const WorkspaceChatPage = () => {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))
    const { currentWorkspace } = useWorkspace()

    const [selectedConversation, setSelectedConversation] = useState<ConversationWithUnread | null>(null)
    const [showConversationList, setShowConversationList] = useState(true)
    const [createDialogOpen, setCreateDialogOpen] = useState(false)

    // Fetch conversations
    const { conversations, isLoading: conversationsLoading, mutate: mutateConversations } = useConversations(
        currentWorkspace?.id,
        {
            page: 1,
            limit: PAGE_LIMIT_DEFAULT.limit
        }
    )

    // Fetch messages for selected conversation
    const {
        messages,
        hasMore,
        isLoading: messagesLoading,
        loadMore,
        addMessage,
        markAsRead
    } = useMessages(selectedConversation?.id)

    // Chat socket integration
    const {
        isConnected,
        joinConversation,
        leaveConversation,
        sendMessage: sendSocketMessage,
        startTyping,
        stopTyping,
        onNewMessage,
        getTypingUsers
    } = useChat()

    // Handle conversation selection
    const handleSelectConversation = useCallback((conversation: ConversationWithUnread) => {
        // Leave previous conversation
        if (selectedConversation) {
            leaveConversation(selectedConversation.id)
        }

        // Select new conversation
        setSelectedConversation(conversation)

        // On mobile, hide conversation list when selecting
        if (isMobile) {
            setShowConversationList(false)
        }

        // Join new conversation room
        joinConversation(conversation.id)
    }, [selectedConversation, leaveConversation, joinConversation, isMobile])



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

    // Get typing users for current conversation
    const typingUsers = selectedConversation
        ? getTypingUsers(selectedConversation.id)
        : []

    // Handle create conversation
    const handleCreateConversation = () => {
        setCreateDialogOpen(true)
    }

    // Handle conversation created successfully
    const handleConversationCreated = useCallback(async (conversationId: string) => {
        // Refresh conversations list and wait for new data
        const updatedData = await mutateConversations()

        // Find and select the new conversation from updated data
        if (updatedData?.data) {
            const newConv = updatedData.data.find((c: ConversationWithUnread) => c.id === conversationId)
            if (newConv) {
                handleSelectConversation(newConv)
            }
        }
    }, [mutateConversations, handleSelectConversation])

    if (!currentWorkspace) {
        return (
            <Box sx={{ p: 3 }}>
                <p>Không tìm thấy workspace</p>
            </Box>
        )
    }

    // Mobile layout: show either list or chat
    if (isMobile) {
        return (
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {showConversationList ? (
                    // Conversation list
                    <ConversationList
                        conversations={conversations}
                        activeConversationId={selectedConversation?.id}
                        onSelectConversation={handleSelectConversation}
                        onCreateConversation={handleCreateConversation}
                        isLoading={conversationsLoading}
                        onSearchChange={(value) => {
                            // TODO: Implement search
                            console.log('Search:', value)
                        }}
                    />
                ) : (
                    // Chat view
                    <>
                        <MessageList
                            messages={messages}
                            isLoading={messagesLoading}
                            hasMore={hasMore}
                            onLoadMore={loadMore}
                            typingUsers={typingUsers}
                        />
                        <MessageInput
                            onSend={handleSendMessage}
                            onTyping={() => selectedConversation && startTyping(selectedConversation.id)}
                            onStopTyping={() => selectedConversation && stopTyping(selectedConversation.id)}
                        />
                    </>
                )}
            </Box>
        )
    }

    // Desktop layout: split view
    return (
        <Box
            sx={{
                height: '100%',
                display: 'flex',
                bgcolor: 'background.default'
            }}
        >
            {/* Conversation List - 30% */}
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
                    onSearchChange={(value) => {
                        // TODO: Implement search
                        console.log('Search:', value)
                    }}
                />
            </Box>

            {/* Chat View - 70% */}
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
                        <MessageList
                            messages={messages}
                            isLoading={messagesLoading}
                            hasMore={hasMore}
                            onLoadMore={loadMore}
                            typingUsers={typingUsers}
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

            {/* Create Conversation Dialog */}
            <CreateConversationDialog
                open={createDialogOpen}
                onClose={() => setCreateDialogOpen(false)}
                onSuccess={handleConversationCreated}
            />
        </Box>
    )
}
