import { forwardRef } from 'react'
import MuiButton, { type ButtonProps as MuiButtonProps } from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import { useTheme } from '@mui/material/styles'
import { Box } from '@mui/material'
import type { ReactNode } from 'react'


export interface ButtonComponentProps
    extends Omit<MuiButtonProps, 'variant' | 'startIcon' | 'endIcon'> {

    variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
    shape?: 'rounded' | 'square' | 'circle'

    icon?: ReactNode
    iconPosition?: 'start' | 'end'

    sizeUI?: 'sm' | 'md'
    loading?: boolean
}


export const ButtonComponent = forwardRef<
    HTMLButtonElement,
    ButtonComponentProps
>(({
    variant = 'primary',
    shape = 'rounded',
    icon,
    iconPosition = 'start',
    loading = false,
    disabled,
    sizeUI = 'md',
    children,
    sx,
    ...rest
}, ref) => {
    const theme = useTheme()

    const isDisabled = disabled || loading
    const iconOnly = !!icon && !children
    const isSmall = sizeUI === 'sm'

    const borderRadius =
        shape === 'circle'
            ? '50%'
            : shape === 'square'
                ? 8
                : theme.shape.borderRadius

    const spinner = (
        <CircularProgress
            size={isSmall ? 14 : 16}
            thickness={4}
            color="inherit"
        />
    )

    return (
        <MuiButton
            ref={ref}
            disabled={isDisabled}
            disableElevation
            {...rest}
            sx={{
                textTransform: 'none',
                fontWeight: 600,
                borderRadius,

                minHeight: isSmall ? 32 : 36,
                minWidth: iconOnly
                    ? isSmall ? 32 : 36
                    : undefined,
                px: iconOnly ? 0 : isSmall ? 2 : 2.5,
                py: isSmall ? 0.5 : 1,
                fontSize: isSmall ? 13 : undefined,

                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,

                transition: theme.transitions.create(
                    ['background-color', 'box-shadow'],
                    { duration: theme.transitions.duration.short },
                ),

                ...(variant === 'primary' && {
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    '&:hover': {
                        backgroundColor: theme.palette.primary.dark,
                    },
                }),

                ...(variant === 'secondary' && {
                    backgroundColor: theme.palette.action.selected,
                    color: theme.palette.text.primary,
                    '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                    },
                }),

                ...(variant === 'ghost' && {
                    backgroundColor: 'transparent',
                    color: theme.palette.text.primary,
                    '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                    },
                }),

                ...(variant === 'danger' && {
                    backgroundColor: theme.palette.error.main,
                    color: theme.palette.error.contrastText,
                    '&:hover': {
                        backgroundColor: theme.palette.error.dark,
                    },
                }),

                ...(loading && {
                    pointerEvents: 'none',
                    opacity: theme.palette.action.disabledOpacity,
                }),

                ...sx,
            }}
        >
            {(icon || loading) && iconPosition === 'start' && (
                <Box display="flex" alignItems="center">
                    {loading ? spinner : icon}
                </Box>
            )}

            {children && (
                <Box
                    sx={{
                        visibility:
                            loading && !icon ? 'hidden' : 'visible',
                    }}
                >
                    {children}
                </Box>
            )}

            {(icon || loading) && iconPosition === 'end' && (
                <Box display="flex" alignItems="center">
                    {loading ? spinner : icon}
                </Box>
            )}

            {iconOnly && loading && spinner}
        </MuiButton>
    )
})
