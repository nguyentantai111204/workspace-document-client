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
import FolderIcon from '@mui/icons-material/Folder'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../redux/store.redux'
import { setSidebarOpen } from '../../redux/system/system.slice'
import { WorkspaceSwitcherComponent, Workspace } from '../../components/workspace/workspace-switcher.component'
import { SIDEBAR_WIDTH, TIME_ANIMATION } from '../../common/constant/style.constant'
import { useThemeMode } from '../../contexts/theme-mode.context'
import { useWorkspace } from '../../contexts/workspace.context'


const MENU_ITEMS = [
    { text: 'Workspace', icon: <FolderIcon />, path: '/workspace' },
] as const

const SidebarContent = ({ onItemClick }: { onItemClick?: () => void }) => {
    const theme = useTheme()
    const navigate = useNavigate()
    const location = useLocation()
    const { workspaces, currentWorkspace, setCurrentWorkspace, isLoading } = useWorkspace()

    const mappedWorkspaces: Workspace[] = workspaces.map(ws => ({
        id: ws.id,
        name: ws.name,
        avatar: '/assets/images/avatar/avatar-1.webp',
        plan: 'Free'
    }))

    const mappedCurrentWorkspace: Workspace | undefined = currentWorkspace ? {
        id: currentWorkspace.id,
        name: currentWorkspace.name,
        avatar: '/assets/images/avatar/avatar-1.webp',
        plan: 'Free'
    } : undefined

    const handleNavigate = (path: string) => {
        navigate(path)
        onItemClick?.()
    }

    if (isLoading) {
        return <Box sx={{ p: 2 }}>Loading...</Box>
    }

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

            {mappedCurrentWorkspace && (
                <WorkspaceSwitcherComponent
                    currentWorkspace={mappedCurrentWorkspace}
                    workspaces={mappedWorkspaces}
                    onWorkspaceChange={(ws: Workspace) => {
                        const selected = workspaces.find((w: { id: string }) => w.id === ws.id)
                        if (selected) {
                            setCurrentWorkspace(selected)
                        }
                    }}
                />
            )}

            <List disablePadding>
                {MENU_ITEMS.map((item) => {
                    const isActive = location.pathname === item.path

                    return (
                        <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                            <ListItemButton
                                selected={isActive}
                                onClick={() => handleNavigate(item.path)}
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
                                    '&.Mui-selected:hover': {
                                        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
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
                            </ListItemButton>
                        </ListItem>
                    )
                })}
            </List>
        </Box>
    )
}

const DesktopSidebar = () => {
    const theme = useTheme()
    const { mode } = useThemeMode()

    const sidebarBgColor = mode === 'dark'
        ? theme.palette.background.paper
        : alpha(theme.palette.background.default, 0.8)

    return (
        <Drawer
            variant="permanent"
            open
            PaperProps={{
                sx: {
                    width: SIDEBAR_WIDTH,
                    bgcolor: sidebarBgColor,
                    backdropFilter: 'blur(6px)',
                    borderRight: `1px solid ${theme.palette.divider}`,
                    transition: theme.transitions.create(['background-color', 'border-color'], {
                        duration: TIME_ANIMATION,
                        easing: theme.transitions.easing.easeInOut,
                    }),
                },
            }}
        >
            <SidebarContent />
        </Drawer>
    )
}

const MobileSidebar = () => {
    const theme = useTheme()
    const { mode } = useThemeMode()
    const dispatch = useAppDispatch()
    const open = useAppSelector((state) => state.system.sidebarOpen)

    const sidebarBgColor = mode === 'dark'
        ? theme.palette.background.paper
        : alpha(theme.palette.background.default, 0.8)

    return (
        <Drawer
            variant="temporary"
            open={open}
            onClose={() => dispatch(setSidebarOpen(false))}
            ModalProps={{ keepMounted: true }}
            PaperProps={{
                sx: {
                    width: SIDEBAR_WIDTH,
                    bgcolor: sidebarBgColor,
                    backdropFilter: 'blur(6px)',
                    borderRight: `1px solid ${theme.palette.divider}`,
                    transition: theme.transitions.create(['background-color', 'border-color'], {
                        duration: TIME_ANIMATION,
                        easing: theme.transitions.easing.easeInOut,
                    }),
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
