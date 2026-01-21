import type { Theme } from '@mui/material'

export type CheckboxShape = 'square' | 'circle'
export type CheckboxVariant = 'filled' | 'outlined'
export type CheckboxIconType = 'check' | 'minus' | 'dot'

export const CHECKBOX_SIZE = {
    sm: 16,
    md: 20,
}

export const getBorderRadius = (
    shape: CheckboxShape
) => (shape === 'circle' ? '50%' : '6px')

export const getIconSx = (
    theme: Theme,
    variant: CheckboxVariant,
    radius: number | string
) => ({
    borderRadius: radius,
    border:
        variant === 'outlined'
            ? `1.5px solid ${theme.palette.divider}`
            : 'none',
    backgroundColor:
        variant === 'filled'
            ? theme.palette.background.paper
            : 'transparent',
})
