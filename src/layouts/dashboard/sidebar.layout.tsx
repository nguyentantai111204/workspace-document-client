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
    Divider,
} from '@mui/material'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../redux/store.redux'
import { setSidebarOpen } from '../../redux/system/system.slice'
import { WorkspaceSwitcherComponent } from '../../pages/workspace/components/workspace-switcher.component'
import { SIDEBAR_WIDTH, TIME_ANIMATION } from '../../common/constant/style.constant'
import { useThemeMode } from '../../contexts/theme-mode.context'
import { useWorkspace } from '../../contexts/workspace.context'
import PeopleIcon from '@mui/icons-material/People'


import { mainRoutes } from '../../router/main.routes'

const MENU_ITEMS = mainRoutes
    .filter(route => route.handle?.title)
    .map(route => ({
        text: route.handle.title,
        icon: route.handle.icon,
        path: `/${route.path}`
    }))

import { CreateWorkspaceDialog } from '../../pages/workspace/components/create-workspace-dialog.component'
import { UpdateWorkspaceDialog } from '../../pages/workspace/components/update-workspace-dialog.component'
import { useState } from 'react'

import { WorkspaceResponse } from '../../apis/workspace/workspace.interface'

const SidebarContent = ({ onItemClick }: { onItemClick?: () => void }) => {
    const theme = useTheme()
    const navigate = useNavigate()
    const location = useLocation()
    const { workspaceId } = useParams()
    const { workspaces, currentWorkspace, setCurrentWorkspace, isLoading } = useWorkspace()
    const [createDialogOpen, setCreateDialogOpen] = useState(false)
    const [updateDialogOpen, setUpdateDialogOpen] = useState(false)
    const [editingWorkspace, setEditingWorkspace] = useState<WorkspaceResponse | null>(null)

    const handleNavigate = (path: string) => {
        navigate(path)
        onItemClick?.()
    }

    const handleEditWorkspace = (ws: WorkspaceResponse) => {
        setEditingWorkspace(ws)
        setUpdateDialogOpen(true)
    }

    if (isLoading) {
        return <Box sx={{ p: 2 }}>Đang tải...</Box>
    }

    // Workspace-specific menu items
    const workspaceMenuItems = workspaceId ? [
        {
            text: 'Thành viên',
            icon: <PeopleIcon />,
            path: `/workspace/${workspaceId}/members`
        }
    ] : []

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

            {currentWorkspace && (
                <WorkspaceSwitcherComponent
                    currentWorkspace={currentWorkspace}
                    workspaces={workspaces}
                    onWorkspaceChange={(ws: WorkspaceResponse) => {
                        setCurrentWorkspace(ws)
                    }}
                    onCreateWorkspace={() => setCreateDialogOpen(true)}
                    onEditWorkspace={handleEditWorkspace}
                />
            )}

            <List disablePadding>
                {MENU_ITEMS.map((item) => {
                    const isActive = location.pathname.startsWith(item.path)

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

            {workspaceMenuItems.length > 0 && (
                <>
                    <Divider sx={{ my: 2 }} />
                    <Typography
                        variant="caption"
                        sx={{
                            px: 2,
                            mb: 1,
                            color: 'text.secondary',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: 0.5
                        }}
                    >
                        Workspace
                    </Typography>
                    <List disablePadding>
                        {workspaceMenuItems.map((item) => {
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
                </>
            )}

            <CreateWorkspaceDialog
                open={createDialogOpen}
                onClose={() => setCreateDialogOpen(false)}
            />

            {editingWorkspace && (
                <UpdateWorkspaceDialog
                    open={updateDialogOpen}
                    onClose={() => {
                        setUpdateDialogOpen(false)
                        setEditingWorkspace(null)
                    }}
                    workspace={editingWorkspace}
                />
            )}
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
