import { useState, useRef, KeyboardEvent } from 'react'
import { Box, IconButton, InputBase, useTheme } from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import { Attachment } from '../../../apis/chat/chat.interface'

interface MessageInputProps {
    onSend: (content: string, attachments: Attachment[]) => void
    onTyping: () => void
    onStopTyping: () => void
    disabled?: boolean
    placeholder?: string
}

export const MessageInput = ({
    onSend,
    onTyping,
    onStopTyping,
    disabled,
    placeholder = 'Nhập tin nhắn...'
}: MessageInputProps) => {
    const theme = useTheme()
    const [message, setMessage] = useState('')
    const [attachments, setAttachments] = useState<Attachment[]>([])
    const typingTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

    const handleTyping = () => {
        onTyping()
        clearTimeout(typingTimer.current)
        typingTimer.current = setTimeout(() => {
            onStopTyping()
        }, 3000)
    }

    const handleSend = () => {
        const trimmedMessage = message.trim()
        if (!trimmedMessage && attachments.length === 0) return

        onSend(trimmedMessage, attachments)
        setMessage('')
        setAttachments([])
        onStopTyping()
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    const handleFileAttach = () => {
        console.log('File attach clicked - implement Cloudinary upload')
    }

    return (
        <Box
            sx={{
                p: 2,
                borderTop: `1px solid ${theme.palette.divider}`,
                bgcolor: 'background.paper'
            }}
        >
            {attachments.length > 0 && (
                <Box
                    sx={{
                        mb: 1,
                        display: 'flex',
                        gap: 1,
                        flexWrap: 'wrap'
                    }}
                >
                    {attachments.map((att, idx) => (
                        <Box
                            key={idx}
                            sx={{
                                p: 1,
                                bgcolor: theme.palette.action.hover,
                                borderRadius: 1,
                                fontSize: '0.75rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5
                            }}
                        >
                            <span>📎</span>
                            {att.name}
                        </Box>
                    ))}
                </Box>
            )}

            {/* Input Container */}
            <Box
                component="div"
                sx={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    gap: 1,
                    bgcolor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[100],
                    borderRadius: 3,
                    p: '8px 12px',
                    transition: 'background-color 0.2s',
                    '&:hover': {
                        bgcolor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.grey[200],
                    },
                    '&:focus-within': {
                        bgcolor: 'transparent',
                        boxShadow: `0 0 0 2px ${theme.palette.primary.main}20`,
                        outline: `1px solid ${theme.palette.primary.main}`
                    }
                }}
            >
                <IconButton
                    size="small"
                    disabled={disabled}
                    onClick={handleFileAttach}
                    sx={{
                        color: 'text.secondary',
                        mb: 0.5
                    }}
                >
                    <AttachFileIcon fontSize="small" />
                </IconButton>

                <InputBase
                    fullWidth
                    multiline
                    maxRows={4}
                    placeholder={placeholder}
                    value={message}
                    onChange={(e) => {
                        setMessage(e.target.value)
                        if (e.target.value) {
                            handleTyping()
                        }
                    }}
                    onKeyDown={handleKeyDown}
                    disabled={disabled}
                    sx={{
                        flex: 1,
                        py: 0.5
                    }}
                />

                <IconButton
                    size="small"
                    onClick={handleSend}
                    disabled={disabled || (!message.trim() && attachments.length === 0)}
                    sx={{
                        color: message.trim() || attachments.length > 0
                            ? 'primary.main'
                            : 'text.disabled',
                        mb: 0.5
                    }}
                >
                    <SendIcon fontSize="small" />
                </IconButton>
            </Box>
        </Box>
    )
}
