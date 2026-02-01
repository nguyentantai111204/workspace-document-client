import { Box, Typography, IconButton, useTheme, useMediaQuery } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { ConversationWithUnread } from '../../../apis/chat/chat.interface'
import { ConversationItem } from './conversation-item.component'
import { TextFieldSearchComponent } from '../../../components/textfield/text-field-search.component'
import { EmptyComponent } from '../../../components/empty/empty.component'
import { LoadingComponent } from '../../../components/loading/loading.component'
import { ButtonComponent } from '../../../components/button/button.component'

interface ConversationListProps {
    conversations: ConversationWithUnread[]
    activeConversationId?: string
    onSelectConversation: (conversation: ConversationWithUnread) => void
    onCreateConversation: () => void
    isLoading?: boolean
    onSearchChange?: (value: string) => void
}

export const ConversationList = ({
    conversations,
    activeConversationId,
    onSelectConversation,
    onCreateConversation,
    isLoading,
    onSearchChange
}: ConversationListProps) => {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))

    return (
        <Box
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRight: { md: `1px solid ${theme.palette.divider}` },
                bgcolor: 'background.paper'
            }}
        >
            <Box
                sx={{
                    p: { xs: 1.5, sm: 2 },
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 1
                }}
            >
                <Typography variant="h6" fontWeight={700}>
                    Trò chuyện
                </Typography>

                {!isMobile ? (
                    <ButtonComponent
                        variant="primary"
                        icon={<AddIcon fontSize="small" />}
                        sizeUI="sm"
                        onClick={onCreateConversation}
                    >
                        Mới
                    </ButtonComponent>
                ) : (
                    <IconButton
                        color="primary"
                        size="small"
                        onClick={onCreateConversation}
                    >
                        <AddIcon />
                    </IconButton>
                )}
            </Box>

            {onSearchChange && (
                <Box sx={{ p: { xs: 1, sm: 2 }, pt: { xs: 1.5, sm: 2 } }}>
                    <TextFieldSearchComponent
                        placeholder="Tìm cuộc trò chuyện..."
                        onChange={onSearchChange}
                    />
                </Box>
            )}

            <Box
                sx={{
                    flex: 1,
                    overflowY: 'auto',
                    '&::-webkit-scrollbar': {
                        width: 6
                    },
                    '&::-webkit-scrollbar-thumb': {
                        bgcolor: theme.palette.divider,
                        borderRadius: 3
                    }
                }}
            >
                {isLoading ? (
                    <LoadingComponent size="medium" />
                ) : conversations.length === 0 ? (
                    <Box sx={{ p: { xs: 2, sm: 4 } }}>
                        <EmptyComponent
                            title="Chưa có cuộc trò chuyện"
                            description="Bắt đầu trò chuyện với đồng nghiệp của bạn"
                        />
                    </Box>
                ) : (
                    conversations.map((conversation) => (
                        <ConversationItem
                            key={conversation.id}
                            conversation={conversation}
                            isActive={conversation.id === activeConversationId}
                            onClick={() => onSelectConversation(conversation)}
                        />
                    ))
                )}
            </Box>
        </Box>
    )
}
