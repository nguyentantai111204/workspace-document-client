import { Menu, MenuItem, ListItemIcon, ListItemText, useTheme, alpha, useMediaQuery } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import ShareIcon from '@mui/icons-material/Share'
// import PushPinIcon from '@mui/icons-material/PushPin'

interface FileActionMenuProps {
    anchorEl: HTMLElement | null
    onClose: () => void
    onEdit?: () => void
    onDelete?: () => void
    onShare?: () => void
    onPin?: () => void
}

export const FileActionMenu = ({
    anchorEl,
    onClose,
    onEdit,
    onDelete,
    onShare,
    // onPin
}: FileActionMenuProps) => {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
    const open = Boolean(anchorEl)

    const handleAction = (action?: () => void) => {
        action?.()
        onClose()
    }

    const iconSize = isMobile ? "small" : "small"
    const iconSx = {
        minWidth: isMobile ? 28 : 36,
        '& .MuiSvgIcon-root': {
            fontSize: isMobile ? 18 : 20
        }
    }
    const textProps = {
        primaryTypographyProps: {
            variant: isMobile ? 'caption' : 'body2',
            fontWeight: 500,
            fontSize: isMobile ? 13 : 14
        }
    } as const

    return (
        <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={onClose}
            onClick={(e) => e.stopPropagation()}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
                elevation: 0,
                sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
                    mt: 1,
                    minWidth: isMobile ? 140 : 180,
                    borderRadius: 2,
                    border: `1px solid ${theme.palette.divider}`,
                    '& .MuiMenuItem-root': {
                        px: isMobile ? 1 : 2,
                        py: isMobile ? 0.5 : 1,
                        typography: 'body2',
                        fontWeight: 500,
                        gap: isMobile ? 0.5 : 1.5,
                        '&:hover': {
                            bgcolor: alpha(theme.palette.primary.main, 0.08),
                        },
                    },
                },
            }}
        >
            <MenuItem onClick={() => handleAction(onEdit)}>
                <ListItemIcon sx={iconSx}>
                    <EditIcon fontSize={iconSize} color="action" />
                </ListItemIcon>
                <ListItemText {...textProps}>Chỉnh sửa</ListItemText>
            </MenuItem>

            <MenuItem onClick={() => handleAction(onShare)}>
                <ListItemIcon sx={iconSx}>
                    <ShareIcon fontSize={iconSize} color="action" />
                </ListItemIcon>
                <ListItemText {...textProps}>Chia sẻ</ListItemText>
            </MenuItem>

            <MenuItem
                onClick={() => handleAction(onDelete)}
                sx={{
                    color: 'error.main',
                    '&:hover': {
                        bgcolor: alpha(theme.palette.error.main, 0.08) + '!important',
                    }
                }}
            >
                <ListItemIcon sx={iconSx}>
                    <DeleteIcon fontSize={iconSize} color="error" />
                </ListItemIcon>
                <ListItemText {...textProps}>Xóa</ListItemText>
            </MenuItem>
        </Menu>
    )
}
