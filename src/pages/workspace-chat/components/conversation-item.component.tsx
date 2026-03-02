import { Box, Typography, Badge, useTheme, alpha, Avatar } from '@mui/material'
import { ConversationWithUnread } from '../../../apis/chat/chat.interface'
import { TimeAgoComponent } from '../../../components/time/time-ago.component'

interface ConversationItemProps {
    conversation: ConversationWithUnread
    isActive: boolean
    onClick: () => void
}

export const ConversationItem = ({
    conversation,
    isActive,
    onClick
}: ConversationItemProps) => {
    const theme = useTheme()

    const displayName = conversation.name || 'Tin nhắn trực tiếp'

    return (
        <Box
            onClick={onClick}
            sx={{
                p: { xs: 1.5, sm: 2 },
                cursor: 'pointer',
                bgcolor: isActive
                    ? alpha(theme.palette.primary.main, 0.08)
                    : 'transparent',
                borderLeft: `3px solid ${isActive ? theme.palette.primary.main : 'transparent'
                    }`,
                '&:hover': {
                    bgcolor: isActive
                        ? alpha(theme.palette.primary.main, 0.12)
                        : theme.palette.action.hover
                },
                transition: 'all 0.2s',
                borderBottom: `1px solid ${theme.palette.divider}`
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                <Badge
                    badgeContent={conversation.unreadCount || 0}
                    color="error"
                    invisible={!conversation.unreadCount}
                    max={99}
                >
                    <Avatar
                        src={conversation.avatarUrl}
                        sx={{
                            width: { xs: 36, sm: 40 },
                            height: { xs: 36, sm: 40 }
                        }}
                    >
                        {displayName.charAt(0).toUpperCase()}
                    </Avatar>
                </Badge>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 0.5,
                            gap: 1
                        }}
                    >
                        <Typography
                            variant="subtitle2"
                            fontWeight={conversation.unreadCount ? 700 : 600}
                            sx={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                flex: 1,
                                fontSize: { xs: '0.875rem', sm: '0.875rem' }
                            }}
                        >
                            {displayName}
                        </Typography>

                        {conversation.lastMessageAt && (
                            <Box
                                component="span"
                                sx={{
                                    fontSize: { xs: '0.7rem', sm: '0.75rem' },
                                    fontWeight: conversation.unreadCount ? 600 : 400,
                                    flexShrink: 0,
                                    color: conversation.unreadCount ? 'primary.main' : 'text.secondary'
                                }}
                            >
                                <TimeAgoComponent value={conversation.lastMessageAt} />
                            </Box>
                        )}
                    </Box>

                    {conversation.lastMessage && (
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                fontWeight: conversation.unreadCount ? 600 : 400,
                                fontSize: { xs: '0.8rem', sm: '0.875rem' }
                            }}
                        >
                            {conversation.lastMessage.content || '📎 Tệp đính kèm'}
                        </Typography>
                    )}
                </Box>
            </Box>
        </Box>
    )
}
