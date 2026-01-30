import { Box, Typography, alpha, useTheme, Menu, MenuItem, Button, Divider, IconButton, Avatar } from '@mui/material'
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import WorkspacesIcon from '@mui/icons-material/Workspaces'
import React, { useState } from 'react'
import { WorkspaceResponse } from '../../../apis/workspace/workspace.interface'

interface WorkspaceSwitcherProps {
    currentWorkspace?: WorkspaceResponse
    workspaces: WorkspaceResponse[]
    onWorkspaceChange?: (workspace: WorkspaceResponse) => void
    onCreateWorkspace?: () => void
    onEditWorkspace?: (workspace: WorkspaceResponse) => void
}

export const WorkspaceSwitcherComponent = ({
    currentWorkspace,
    workspaces,
    onWorkspaceChange,
    onCreateWorkspace,
    onEditWorkspace,
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

    const handleSelectWorkspace = (workspace: WorkspaceResponse) => {
        onWorkspaceChange?.(workspace)
        handleClose()
    }

    const handleCreateWorkspace = () => {
        onCreateWorkspace?.()
    }

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
                <Avatar
                    sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        bgcolor: 'primary.main',
                        fontSize: '1rem',
                        fontWeight: 700,
                    }}
                >
                    {(currentWorkspace.name || '').substring(0, 1).toUpperCase()}
                </Avatar>
                <Box overflow="hidden" flex={1}>
                    <Typography variant="subtitle2" noWrap fontWeight={700}>
                        {currentWorkspace.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" noWrap>
                        Cá nhân
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
                            <Avatar
                                sx={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: '50%',
                                    bgcolor: isActive ? 'primary.main' : 'grey.400',
                                    fontSize: '0.875rem',
                                    fontWeight: 700,
                                }}
                            >
                                {(workspace.name || '').substring(0, 1).toUpperCase()}
                            </Avatar>
                            <Typography variant="body2" noWrap flex={1} fontWeight={isActive ? 600 : 400}>
                                {workspace.name}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <IconButton
                                    size="small"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        onEditWorkspace?.(workspace)
                                    }}
                                    sx={{
                                        p: 0.5,
                                        color: 'text.secondary',
                                        opacity: { xs: 1, md: 0.6 },
                                        transition: theme.transitions.create(['opacity', 'color', 'background-color']),
                                        '&:hover': {
                                            color: 'primary.main',
                                            opacity: 1,
                                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                                        },
                                    }}
                                >
                                    <EditIcon fontSize="inherit" sx={{ fontSize: 16 }} />
                                </IconButton>
                            </Box>
                        </MenuItem>
                    )
                })}

                <Divider sx={{ my: 1 }} />

                <MenuItem
                    onClick={handleCreateWorkspace}
                    sx={{
                        py: 1.5,
                        px: 2,
                        gap: 2,
                        color: 'primary.main',
                        '&:hover': {
                            bgcolor: alpha(theme.palette.primary.main, 0.08),
                        },
                    }}
                >
                    <Box
                        sx={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: `1px dashed ${theme.palette.primary.main}`,
                            bgcolor: alpha(theme.palette.primary.main, 0.08)
                        }}
                    >
                        <AddIcon fontSize="small" />
                    </Box>
                    <Typography variant="body2" fontWeight={600}>
                        Tạo workspace mới
                    </Typography>
                </MenuItem>
            </Menu>
        </React.Fragment>
    )
}
