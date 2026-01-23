import {
    Box,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
    useMediaQuery,
    alpha,
    Stack,
    useTheme,
} from '@mui/material'
import React from 'react'
import DashboardIcon from '@mui/icons-material/Dashboard'
import PersonIcon from '@mui/icons-material/Person'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import BookIcon from '@mui/icons-material/Book'
import LoginIcon from '@mui/icons-material/Login'
import WarningIcon from '@mui/icons-material/Warning'
import { useAppDispatch, useAppSelector } from '../../redux/store.redux'
import { setSidebarOpen } from '../../redux/system/system.slice'
import { WorkspaceSwitcherComponent, Workspace } from '../../components/workspace/workspace-switcher.component'
import { SIDEBAR_WIDTH } from '../../common/constant/style.constant'


const MENU_ITEMS = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'User', icon: <PersonIcon />, path: '/user' },
    { text: 'Product', icon: <ShoppingCartIcon />, path: '/product', badge: '+3' },
    { text: 'Blog', icon: <BookIcon />, path: '/blog' },
    { text: 'Sign in', icon: <LoginIcon />, path: '/login' },
    { text: 'Not found', icon: <WarningIcon />, path: '/404' },
]

const SidebarContent = ({ onItemClick }: { onItemClick?: () => void }) => {
    const theme = useTheme()

    const workspaces = [
        {
            id: '1',
            name: 'Team 1',
            avatar: '/assets/images/avatar/avatar-1.webp',
            plan: 'Free' as const,
        },
        {
            id: '2',
            name: 'Team 2',
            avatar: '/assets/images/avatar/avatar-2.webp',
            plan: 'Pro' as const,
        },
        {
            id: '3',
            name: 'Team 3',
            avatar: '/assets/images/avatar/avatar-3.webp',
            plan: 'Pro' as const,
        },
    ]


    const [currentWorkspace, setCurrentWorkspace] = React.useState<Workspace>(workspaces[0])

    return (
        <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 4, px: 2 }}>
                <Box component="img" src="/favicon.ico" sx={{ width: 32, height: 32, filter: `drop-shadow(0px 4px 6px ${theme.palette.primary.light}80)`, }} />
                <Typography
                    variant="h6"
                    fontWeight={800}
                    sx={{
                        background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        backgroundClip: 'text',
                        textFillColor: 'transparent',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        letterSpacing: -0.5,
                    }}
                >
                    DocWorkspace
                </Typography>
            </Stack>

            <WorkspaceSwitcherComponent
                currentWorkspace={currentWorkspace}
                workspaces={workspaces}
                onWorkspaceChange={(workspace) => {
                    setCurrentWorkspace(workspace)
                    console.log('Switched to:', workspace.name)
                }}
            />

            <List disablePadding>
                {MENU_ITEMS.map((item) => (
                    <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                        <ListItemButton
                            onClick={onItemClick}
                            sx={{
                                borderRadius: (theme) => Number(theme.shape.borderRadius) / 6.67,
                                px: 1.5,
                                py: 1,
                                color: 'text.secondary',
                                '&.Mui-selected': {
                                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                                    color: 'primary.main',
                                    '& .MuiListItemIcon-root': { color: 'primary.main' },
                                    fontWeight: 'fontWeightBold',
                                },
                                '&:hover': {
                                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.04),
                                },
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
                                {item.icon}
                            </ListItemIcon>

                            <ListItemText
                                primary={item.text}
                                primaryTypographyProps={{
                                    variant: 'body2',
                                    fontWeight: 'inherit',
                                }}
                            />

                            {item.badge && (
                                <Box
                                    sx={{
                                        px: 0.8,
                                        py: 0.2,
                                        bgcolor: 'error.main',
                                        color: 'error.contrastText',
                                        borderRadius: (theme) => Number(theme.shape.borderRadius) / 12.5,
                                        typography: 'overline',
                                        fontWeight: 700,
                                    }}
                                >
                                    {item.badge}
                                </Box>
                            )}
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    )
}

const DesktopSidebar = () => {
    return (
        <Drawer
            variant="permanent"
            open
            PaperProps={{
                sx: {
                    width: SIDEBAR_WIDTH,
                    bgcolor: 'background.default',
                    borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
                },
            }}
        >
            <SidebarContent />
        </Drawer>
    )
}

const MobileSidebar = () => {
    const dispatch = useAppDispatch()
    const open = useAppSelector((state) => state.system.sidebarOpen)

    return (
        <Drawer
            variant="temporary"
            open={open}
            onClose={() => dispatch(setSidebarOpen(false))}
            ModalProps={{ keepMounted: true }}
            PaperProps={{
                sx: {
                    width: SIDEBAR_WIDTH,
                    borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
                },
            }}
        >
            <SidebarContent onItemClick={() => dispatch(setSidebarOpen(false))} />
        </Drawer>
    )
}

export const SidebarLayout = () => {
    const isDesktop = useMediaQuery('(min-width:1200px)')

    return (
        <Box component="nav" sx={{ width: { lg: SIDEBAR_WIDTH }, flexShrink: { lg: 0 } }}>
            {isDesktop ? <DesktopSidebar /> : <MobileSidebar />}
        </Box>
    )
}
