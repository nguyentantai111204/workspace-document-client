import {
    Popover,
    Box,
    Typography,
    Divider,
    useTheme,
} from '@mui/material'
import { ReactNode } from 'react'

interface BasePopoverProps {
    anchorEl: HTMLElement | null
    onClose: () => void
    title: string
    subTitle?: string
    footer?: ReactNode
    children: ReactNode
    width?: number
}

export const BasePopoverComponent = ({
    anchorEl,
    onClose,
    title,
    subTitle,
    footer,
    children,
    width = 320,
}: BasePopoverProps) => {
    const open = Boolean(anchorEl)
    const theme = useTheme()
    return (
        <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={onClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            slotProps={{
                paper: {
                    sx: {
                        width,
                        borderRadius: Number(theme.shape.borderRadius) / 5,
                        boxShadow: theme.shadows[3],
                    },
                },
            }}
        >
            <Box sx={{ p: 2 }}>
                <Typography variant="subtitle1" fontWeight={600}>
                    {title}
                </Typography>

                {subTitle && (
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        mt={0.5}
                    >
                        {subTitle}
                    </Typography>
                )}
            </Box>

            <Divider />

            <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
                {children}
            </Box>

            {footer && (
                <>
                    <Divider />
                    <Box sx={{ p: 1.5 }}>
                        {footer}
                    </Box>
                </>
            )}
        </Popover>
    )
}
