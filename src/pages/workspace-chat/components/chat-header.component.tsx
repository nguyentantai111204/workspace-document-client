import { Box, IconButton, Typography, useTheme, Avatar } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { ConversationWithUnread } from '../../../apis/chat/chat.interface'

interface ChatHeaderProps {
    conversation: ConversationWithUnread
    onBack?: () => void
    isMobile?: boolean
    onInfoClick?: () => void
}

export const ChatHeader = ({
    conversation,
    onBack,
    isMobile,
    onInfoClick
}: ChatHeaderProps) => {
    const theme = useTheme()

    return (
        <Box
            sx={{
                height: 64,
                px: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                borderBottom: `1px solid ${theme.palette.divider}`,
                bgcolor: 'background.paper',
                backdropFilter: 'blur(10px)',
                backgroundColor: theme.palette.mode === 'dark'
                    ? 'rgba(30, 30, 30, 0.8)'
                    : 'rgba(255, 255, 255, 0.8)',
                position: 'sticky',
                top: 0,
                zIndex: 10
            }}
        >
            {isMobile && (
                <IconButton
                    onClick={onBack}
                    edge="start"
                    sx={{ color: 'text.primary' }}
                >
                    <ArrowBackIcon />
                </IconButton>
            )}

            <Avatar
                src={conversation.avatarUrl || undefined}
                alt={conversation.name || 'Conversation'}
                sx={{ width: 40, height: 40 }}
            >
                {conversation.name?.charAt(0).toUpperCase()}
            </Avatar>

            <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    noWrap
                    sx={{ lineHeight: 1.2 }}
                >
                    {conversation.name || 'Người dùng'}
                </Typography>
                <Typography
                    variant="caption"
                    color="text.secondary"
                    noWrap
                    sx={{ display: 'block' }}
                >
                    Đang hoạt động
                </Typography>
            </Box>

            <IconButton onClick={onInfoClick} sx={{ color: 'text.secondary' }}>
                <InfoOutlinedIcon />
            </IconButton>
        </Box >
    )
}
