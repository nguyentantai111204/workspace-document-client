import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    IconButton,
    Box,
    useTheme,
    useMediaQuery
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { ReactNode } from 'react'
import { ButtonComponent } from '../button/button.component'

export interface DialogComponentProps {
    open: boolean
    onClose: () => void
    title: ReactNode
    children: ReactNode

    // Actions
    onConfirm?: () => void
    confirmText?: string
    cancelText?: string
    loading?: boolean
    disabled?: boolean
    showActions?: boolean
    renderActions?: () => ReactNode

    // Config
    maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
    fullWidth?: boolean
}

export const DialogComponent = ({
    open,
    onClose,
    title,
    children,
    onConfirm,
    confirmText = 'Xác nhận',
    cancelText = 'Hủy',
    loading = false,
    disabled = false,
    showActions = true,
    renderActions,
    maxWidth = 'sm',
    fullWidth = true
}: DialogComponentProps) => {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

    return (
        <Dialog
            open={open}
            onClose={loading ? undefined : onClose}
            maxWidth={maxWidth}
            fullWidth={fullWidth}
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    m: isMobile ? 2 : 3
                }
            }}
        >
            <DialogTitle
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    p: 2.5,
                    borderBottom: `1px solid ${theme.palette.divider}`
                }}
            >
                <Typography variant="h6" fontWeight={600} component="div">
                    {title}
                </Typography>
                <IconButton
                    onClick={onClose}
                    disabled={loading}
                    size="small"
                    sx={{ color: 'text.secondary' }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 2.5 }}>
                {children}
            </DialogContent>

            {showActions && (
                <DialogActions sx={{ p: 2.5, pt: 1.5, borderTop: `1px solid ${theme.palette.divider}` }}>
                    {renderActions ? (
                        renderActions()
                    ) : (
                        <Box sx={{ display: 'flex', gap: 1.5, width: '100%', justifyContent: 'flex-end' }}>
                            <ButtonComponent
                                variant="ghost"
                                onClick={onClose}
                                disabled={loading}
                                sizeUI="md"
                            >
                                {cancelText}
                            </ButtonComponent>
                            {onConfirm && (
                                <ButtonComponent
                                    variant="primary"
                                    onClick={onConfirm}
                                    loading={loading}
                                    disabled={disabled || loading}
                                    sizeUI="md"
                                >
                                    {confirmText}
                                </ButtonComponent>
                            )}
                        </Box>
                    )}
                </DialogActions>
            )}
        </Dialog>
    )
}
