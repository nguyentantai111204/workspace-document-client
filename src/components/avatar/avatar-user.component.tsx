import { Avatar, IconButton, Button, ListItemButton, List, ListItemIcon, ListItemText } from '@mui/material'
import React, { useState } from 'react'
import { BasePopoverComponent } from '../popover/base-popover.component'
import PersonIcon from '@mui/icons-material/Person'
import SettingsIcon from '@mui/icons-material/Settings'
import LogoutIcon from '@mui/icons-material/Logout'
import { useAppDispatch, useAppSelector } from '../../redux/store.redux'
import { logout } from '../../redux/account/account.action'
import { useNavigate } from 'react-router-dom'



export const AvatarUserComponent = () => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
    const dispatch = useAppDispatch()
    const { user } = useAppSelector((state) => state.account)
    const navigate = useNavigate()

    const handleLogout = async () => {
        await dispatch(logout())
        navigate('/login')
    }

    return (
        <React.Fragment>
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                <Avatar
                    src={user?.avatarUrl || "/assets/images/avatar/avatar-25.webp"}
                    sx={{ width: 36, height: 36 }}
                    alt={user?.fullName || "User"}
                />
            </IconButton>

            <BasePopoverComponent
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
                title={user?.fullName || "User"}
                subTitle={user?.email || ""}
                footer={
                    <Button
                        color="error"
                        fullWidth
                        startIcon={<LogoutIcon />}
                        onClick={handleLogout}
                    >
                        Logout
                    </Button>
                }
                width={320}
            >
                <List disablePadding>
                    <ListItemButton
                        onClick={() => {
                            setAnchorEl(null)
                            navigate('/profile')
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
