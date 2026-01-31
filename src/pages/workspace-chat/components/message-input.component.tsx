import { useState, useRef, KeyboardEvent } from 'react'
import { Box, IconButton, TextField, useTheme, useMediaQuery } from '@mui/material'
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
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
    const [message, setMessage] = useState('')
    const [attachments, setAttachments] = useState<Attachment[]>([])
    const typingTimer = useRef<NodeJS.Timeout>()

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

    const handleKeyPress = (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    const handleFileAttach = () => {
        // TODO: Implement file upload with Cloudinary
        console.log('File attach clicked - implement Cloudinary upload')
    }

    return (
        <Box
            sx={{
                p: { xs: 1, sm: 2 },
                borderTop: `1px solid ${theme.palette.divider}`,
                bgcolor: 'background.paper'
            }}
        >
            {/* Attachments preview */}
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
                                fontSize: '0.75rem'
                            }}
                        >
                            📎 {att.name}
                        </Box>
                    ))}
                </Box>
            )}

            {/* Input area */}
            <Box
                sx={{
                    display: 'flex',
                    gap: 1,
                    alignItems: 'flex-end'
                }}
            >
                <IconButton
                    size="small"
                    disabled={disabled}
                    onClick={handleFileAttach}
                    sx={{
                        color: 'text.secondary',
                        '&:hover': {
                            color: 'primary.main'
                        }
                    }}
                >
                    <AttachFileIcon fontSize="small" />
                </IconButton>

                <TextField
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
                    onKeyPress={handleKeyPress}
                    disabled={disabled}
                    size={isMobile ? 'small' : 'medium'}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            bgcolor: theme.palette.mode === 'dark'
                                ? theme.palette.grey[900]
                                : theme.palette.grey[50]
                        }
                    }}
                />

                <IconButton
                    color="primary"
                    onClick={handleSend}
                    disabled={disabled || (!message.trim() && attachments.length === 0)}
                    sx={{
                        bgcolor: message.trim() || attachments.length > 0
                            ? 'primary.main'
                            : 'action.disabledBackground',
                        color: message.trim() || attachments.length > 0
                            ? 'primary.contrastText'
                            : 'text.disabled',
                        '&:hover': {
                            bgcolor: message.trim() || attachments.length > 0
                                ? 'primary.dark'
                                : 'action.disabledBackground'
                        },
                        '&:disabled': {
                            bgcolor: 'action.disabledBackground',
                            color: 'text.disabled'
                        }
                    }}
                >
                    <SendIcon fontSize="small" />
                </IconButton>
            </Box>
        </Box>
    )
}
