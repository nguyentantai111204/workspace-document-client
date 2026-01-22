import {
    IconButton,
    Badge,
    Button,
    Stack,
    Typography,
} from '@mui/material'
import NotificationsIcon from '@mui/icons-material/Notifications'
import { useState } from 'react'
import { BasePopoverComponent } from '../popover/base-popover.component'

export const NotificationBellComponent = () => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

    return (
        <>
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                <Badge badgeContent={2} color="error">
                    <NotificationsIcon />
                </Badge>
            </IconButton>

            <BasePopoverComponent
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
                title="Notifications"
                subTitle="You have 2 unread messages"
                footer={
                    <Button fullWidth>
                        View all
                    </Button>
                }
            >
                <Stack spacing={1.5} p={2}>
                    <Typography variant="body2">
                        New order received
                    </Typography>
                    <Typography variant="body2">
                        Product out of stock
                    </Typography>
                </Stack>
            </BasePopoverComponent>
        </>
    )
}
