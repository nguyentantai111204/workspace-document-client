import { Box, useTheme, Button } from '@mui/material'
import { useRef, useEffect } from 'react'
import { Message } from '../../../apis/chat/chat.interface'
import { MessageItem } from './message-item.component'
import { TypingIndicator } from './typing-indicator.component'
import { EmptyComponent } from '../../../components/empty/empty.component'
import { LoadingComponent } from '../../../components/loading/loading.component'

interface MessageListProps {
    messages: Message[]
    isLoading?: boolean
    hasMore?: boolean
    onLoadMore?: () => void
    typingUsers?: string[]
}

export const MessageList = ({
    messages = [],
    isLoading,
    hasMore,
    onLoadMore,
    typingUsers = []
}: MessageListProps) => {
    const theme = useTheme()
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const messageListRef = useRef<HTMLDivElement>(null)
    const prevMessagesLengthRef = useRef(messages.length)

    // Auto scroll to bottom on new message
    useEffect(() => {
        if (messages.length > prevMessagesLengthRef.current) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
        }
        prevMessagesLengthRef.current = messages.length
    }, [messages])

    // Initial scroll to bottom
    useEffect(() => {
        if (messages.length > 0 && messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView()
        }
    }, [messages.length > 0])

    const isConsecutive = (currentMsg: Message, prevMsg: Message | undefined) => {
        if (!prevMsg) return false
        return (
            prevMsg.senderId === currentMsg.senderId &&
            new Date(currentMsg.createdAt).getTime() - new Date(prevMsg.createdAt).getTime() < 60000 // Within 1 minute
        )
    }

    return (
        <Box
            ref={messageListRef}
            sx={{
                flex: 1,
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: theme.palette.mode === 'dark'
                    ? theme.palette.grey[900]
                    : theme.palette.grey[50],
                '&::-webkit-scrollbar': {
                    width: 6
                },
                '&::-webkit-scrollbar-thumb': {
                    bgcolor: theme.palette.divider,
                    borderRadius: 3
                }
            }}
        >
            {/* Load More Button */}
            {hasMore && (
                <Box sx={{ p: 2, textAlign: 'center' }}>
                    <Button
                        size="small"
                        onClick={onLoadMore}
                        disabled={isLoading}
                    >
                        Tải thêm tin nhắn
                    </Button>
                </Box>
            )}

            {/* Loading */}
            {isLoading && messages.length === 0 && (
                <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <LoadingComponent size="medium" />
                </Box>
            )}

            {/* Empty State */}
            {!isLoading && messages.length === 0 && (
                <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4 }}>
                    <EmptyComponent
                        title="Chưa có tin nhắn"
                        description="Gửi tin nhắn đầu tiên để bắt đầu cuộc trò chuyện"
                    />
                </Box>
            )}

            {/* Messages */}
            {messages.length > 0 && (
                <Box sx={{ py: 2 }}>
                    {messages.map((message, index) => {
                        const prevMessage = index > 0 ? messages[index - 1] : undefined
                        const isConsec = isConsecutive(message, prevMessage)

                        return (
                            <MessageItem
                                key={message.id}
                                message={message}
                                isConsecutive={isConsec}
                            />
                        )
                    })}
                </Box>
            )}

            {/* Typing Indicator */}
            {typingUsers.length > 0 && (
                <TypingIndicator userNames={typingUsers} />
            )}

            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
        </Box>
    )
}
