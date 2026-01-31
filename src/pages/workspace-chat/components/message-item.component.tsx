import { Box, Typography, useTheme, Avatar } from '@mui/material'
import { Message } from '../../../apis/chat/chat.interface'
import { TimeAgoComponent } from '../../../components/time/time-ago.component'
import { useAppSelector } from '../../../redux/store.redux'

interface MessageItemProps {
    message: Message
    isConsecutive?: boolean
    showAvatar?: boolean
}

export const MessageItem = ({
    message,
    isConsecutive = false,
    showAvatar = true
}: MessageItemProps) => {
    const theme = useTheme()
    const currentUserId = useAppSelector(state => state.account?.user?.id)
    const isOwnMessage = message.senderId === currentUserId

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
                mb: isConsecutive ? 0.5 : 1.5,
                px: { xs: 1, sm: 2 }
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    gap: 1,
                    maxWidth: { xs: '85%', sm: '70%' },
                    flexDirection: isOwnMessage ? 'row-reverse' : 'row'
                }}
            >
                {/* Avatar (only show for first message in sequence) */}
                {!isConsecutive && showAvatar && !isOwnMessage ? (
                    <Avatar
                        sx={{
                            width: { xs: 28, sm: 32 },
                            height: { xs: 28, sm: 32 },
                            flexShrink: 0
                        }}
                    >
                        {message.senderId.charAt(0).toUpperCase()}
                    </Avatar>
                ) : !isOwnMessage ? (
                    <Box sx={{ width: { xs: 28, sm: 32 } }} />
                ) : null}

                <Box sx={{ flex: 1 }}>
                    {/* Message bubble */}
                    <Box
                        sx={{
                            bgcolor: isOwnMessage
                                ? theme.palette.primary.main
                                : theme.palette.mode === 'dark'
                                    ? theme.palette.grey[800]
                                    : theme.palette.grey[200],
                            color: isOwnMessage
                                ? theme.palette.primary.contrastText
                                : theme.palette.text.primary,
                            borderRadius: 2,
                            px: { xs: 1.5, sm: 2 },
                            py: { xs: 1, sm: 1.5 },
                            wordBreak: 'break-word'
                        }}
                    >
                        <Typography
                            variant="body2"
                            sx={{
                                fontSize: { xs: '0.875rem', sm: '0.9375rem' },
                                lineHeight: 1.5,
                                whiteSpace: 'pre-wrap'
                            }}
                        >
                            {message.content}
                        </Typography>

                        {/* Attachments */}
                        {message.attachments && message.attachments.length > 0 && (
                            <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                {message.attachments.map((attachment, idx) => (
                                    <Box
                                        key={idx}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 0.5,
                                            p: 0.5,
                                            borderRadius: 1,
                                            bgcolor: isOwnMessage
                                                ? 'rgba(255,255,255,0.1)'
                                                : theme.palette.action.hover
                                        }}
                                    >
                                        {attachment.type === 'image' ? (
                                            <img
                                                src={attachment.url}
                                                alt={attachment.name}
                                                style={{
                                                    maxWidth: '100%',
                                                    borderRadius: 4,
                                                    cursor: 'pointer'
                                                }}
                                            />
                                        ) : (
                                            <Typography variant="caption">
                                                📎 {attachment.name}
                                            </Typography>
                                        )}
                                    </Box>
                                ))}
                            </Box>
                        )}
                    </Box>

                    {/* Timestamp */}
                    {!isConsecutive && (
                        <Box
                            sx={{
                                mt: 0.5,
                                textAlign: isOwnMessage ? 'right' : 'left'
                            }}
                        >
                            <Box
                                component="span"
                                sx={{
                                    fontSize: { xs: '0.7rem', sm: '0.75rem' },
                                    color: 'text.secondary'
                                }}
                            >
                                <TimeAgoComponent value={message.createdAt} />
                            </Box>
                        </Box>
                    )}
                </Box>
            </Box>
        </Box>
    )
}
