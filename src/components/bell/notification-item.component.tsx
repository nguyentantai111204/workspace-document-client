import {
    Avatar,
    Box,
    Stack,
    Typography,
} from '@mui/material'
import { TimeAgoComponent } from '../time/time-ago.component'

interface NotificationItemProps {
    avatar?: string
    userName: string
    action: string
    target?: string
    createdAt: string | Date
    unread?: boolean
}

export const NotificationItemComponent = ({
    avatar,
    userName,
    action,
    target,
    createdAt,
    unread = false,
}: NotificationItemProps) => {
    return (
        <Stack
            direction="row"
            spacing={1.5}
            sx={{
                px: 2,
                py: 1.5,
                cursor: 'pointer',
                bgcolor: unread ? 'action.hover' : 'transparent',
                '&:hover': {
                    bgcolor: 'action.hover',
                },
            }}
        >
            <Avatar src={avatar} sx={{ width: 40, height: 40 }} />

            <Box flex={1}>
                <Typography variant="body2">
                    <Box component="span" sx={{ fontWeight: 600 }}>
                        {userName}
                    </Box>
                    <Box component="span" sx={{ color: 'text.secondary', mx: 0.5 }}>
                        {action}
                    </Box>
                    {target && (
                        <Box component="span" sx={{ fontWeight: 600 }}>
                            {target}
                        </Box>
                    )}
                </Typography>

                <TimeAgoComponent value={createdAt} />
            </Box>
        </Stack>
    )
}
