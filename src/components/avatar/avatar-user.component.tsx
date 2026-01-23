import { Avatar, IconButton, Button, ListItemButton, List, ListItemIcon, ListItemText } from '@mui/material'
import React, { useState } from 'react'
import { BasePopoverComponent } from '../popover/base-popover.component'
import PersonIcon from '@mui/icons-material/Person'
import SettingsIcon from '@mui/icons-material/Settings'
import LogoutIcon from '@mui/icons-material/Logout'



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
                    <Button
                        color="error"
                        fullWidth
                        startIcon={<LogoutIcon />}
                        onClick={() => {
                            // dispatch(logout())
                            // navigate('/login')
                        }}
                    >
                        Logout
                    </Button>
                }
            >
                <List disablePadding>
                    <ListItemButton
                        onClick={() => {
                            setAnchorEl(null)
                            // navigate('/profile')
                        }}
                    >
                        <ListItemIcon>
                            <PersonIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Profile" />
                    </ListItemButton>

                    <ListItemButton
                        onClick={() => {
                            setAnchorEl(null)
                            // navigate('/settings')
                        }}
                    >
                        <ListItemIcon>
                            <SettingsIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Settings" />
                    </ListItemButton>
                </List>
            </BasePopoverComponent>
        </React.Fragment>
    )
}
