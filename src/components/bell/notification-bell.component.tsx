import {
    IconButton,
    Badge,
    Button,
} from '@mui/material'
import NotificationsIcon from '@mui/icons-material/Notifications'
import React, { useState } from 'react'
import { BasePopoverComponent } from '../popover/base-popover.component'
import { NotificationItemComponent } from './notification-item.component'

export const NotificationBellComponent = () => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

    return (
        <React.Fragment>
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
                <NotificationItemComponent
                    avatar="https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-25.webp"
                    userName="John Doe"
                    action="liked your post"
                    createdAt="2025-01-18T08:00:00"
                />
            </BasePopoverComponent>
        </React.Fragment>
    )
}
