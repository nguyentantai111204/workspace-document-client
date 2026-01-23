import { Box, Typography, alpha, useTheme, Menu, MenuItem, Chip, Button } from '@mui/material'
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore'
import AddIcon from '@mui/icons-material/Add'
import WorkspacesIcon from '@mui/icons-material/Workspaces'
import React, { useState } from 'react'

export interface Workspace {
    id: string
    name: string
    avatar: string
    plan: 'Free' | 'Pro' | 'Enterprise'
}

interface WorkspaceSwitcherProps {
    currentWorkspace?: Workspace
    workspaces: Workspace[]
    onWorkspaceChange?: (workspace: Workspace) => void
    onCreateWorkspace?: () => void
}

export const WorkspaceSwitcherComponent = ({
    currentWorkspace,
    workspaces,
    onWorkspaceChange,
    onCreateWorkspace,
}: WorkspaceSwitcherProps) => {
    const theme = useTheme()
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const open = Boolean(anchorEl)

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        if (workspaces.length > 0) {
            setAnchorEl(event.currentTarget)
        }
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    const handleSelectWorkspace = (workspace: Workspace) => {
        onWorkspaceChange?.(workspace)
        handleClose()
    }

    const handleCreateWorkspace = () => {
        onCreateWorkspace?.()
        console.log('Create workspace clicked')
    }

    const getPlanColor = (plan: Workspace['plan']) => {
        switch (plan) {
            case 'Pro':
                return 'info'
            case 'Enterprise':
                return 'success'
            default:
                return 'default'
        }
    }

    // Empty state when no workspaces exist
    if (workspaces.length === 0 || !currentWorkspace) {
        return (
            <Box
                sx={{
                    px: 2,
                    py: 3,
                    mb: 3,
                    bgcolor: (theme) => alpha(theme.palette.grey[500], 0.08),
                    borderRadius: (theme) => Number(theme.shape.borderRadius) / 5,
                    textAlign: 'center',
                }}
            >
                <WorkspacesIcon
                    sx={{
                        fontSize: 48,
                        color: 'text.disabled',
                        mb: 1,
                    }}
                />
                <Typography variant="body2" color="text.secondary" gutterBottom>
                    Bạn chưa có workspace nào
                </Typography>
                <Button
                    variant="outlined"
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={handleCreateWorkspace}
                    sx={{
                        mt: 1.5,
                        textTransform: 'none',
                        borderRadius: 2,
                    }}
                >
                    Tạo workspace mới
                </Button>
            </Box>
        )
    }

    return (
        <React.Fragment>
            <Box
                onClick={handleClick}
                sx={{
                    px: 2,
                    py: 1.5,
                    mb: 3,
                    bgcolor: (theme) => alpha(theme.palette.grey[500], 0.08),
                    borderRadius: (theme) => Number(theme.shape.borderRadius) / 5,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    cursor: 'pointer',
                    transition: theme.transitions.create(['background-color']),
                    '&:hover': {
                        bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
                    },
                }}
            >
                <Box
                    component="img"
                    src={currentWorkspace.avatar}
                    alt={currentWorkspace.name}
                    sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        objectFit: 'cover',
                    }}
                />
                <Box overflow="hidden" flex={1}>
                    <Typography variant="subtitle2" noWrap>
                        {currentWorkspace.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                        {currentWorkspace.plan}
                    </Typography>
                </Box>
                <UnfoldMoreIcon
                    sx={{
                        color: 'text.secondary',
                        fontSize: 20,
                        transition: theme.transitions.create('transform'),
                        transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                />
            </Box>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                slotProps={{
                    paper: {
                        sx: {
                            width: anchorEl?.offsetWidth || 260,
                            mt: 0.5,
                            borderRadius: Number(theme.shape.borderRadius) / 5,
                            boxShadow: theme.shadows[3],
                        },
                    },
                }}
            >
                {workspaces.map((workspace) => {
                    const isActive = workspace.id === currentWorkspace.id

                    return (
                        <MenuItem
                            key={workspace.id}
                            onClick={() => handleSelectWorkspace(workspace)}
                            selected={isActive}
                            sx={{
                                py: 1.5,
                                px: 2,
                                gap: 2,
                                bgcolor: isActive
                                    ? alpha(theme.palette.primary.main, 0.08)
                                    : 'transparent',
                                '&:hover': {
                                    bgcolor: isActive
                                        ? alpha(theme.palette.primary.main, 0.12)
                                        : alpha(theme.palette.grey[500], 0.08),
                                },
                            }}
                        >
                            <Box
                                component="img"
                                src={workspace.avatar}
                                alt={workspace.name}
                                sx={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                }}
                            />
                            <Typography variant="body2" noWrap flex={1}>
                                {workspace.name}
                            </Typography>
                            <Chip
                                label={workspace.plan}
                                size="small"
                                color={getPlanColor(workspace.plan)}
                                sx={{
                                    height: 20,
                                    fontSize: '0.6875rem',
                                    fontWeight: 600,
                                }}
                            />
                        </MenuItem>
                    )
                })}
            </Menu>
        </React.Fragment>
    )
}
