import { Avatar, IconButton, Button, Stack, Typography } from '@mui/material'
import React, { useState } from 'react'
import { BasePopoverComponent } from '../popover/base-popover.component'

export const AvatarUserComponent = () => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

    return (
        <React.Fragment>
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                <Avatar
                    src="/assets/images/avatar/avatar-25.webp"
                    sx={{ width: 36, height: 36 }}
                />
            </IconButton>

            <BasePopoverComponent
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
                title="Account"
                subTitle="admin@email.com"
                footer={
                    <Button color="error" fullWidth>
                        Logout
                    </Button>
                }
            >
                <Stack spacing={1.5} p={2}>
                    <Typography variant="body2">Profile</Typography>
                    <Typography variant="body2">Settings</Typography>
                </Stack>
            </BasePopoverComponent>
        </React.Fragment>
    )
}
