import type { Theme } from '@mui/material'

export type CheckboxShape = 'square' | 'circle'
export type CheckboxVariant = 'filled' | 'outlined'
export type CheckboxIconType = 'check' | 'minus' | 'dot'

export const CHECKBOX_SIZE = {
    sm: 16,
    md: 20,
}

export const getBorderRadius = (
    shape: CheckboxShape,
    theme: Theme
) => (shape === 'circle' ? '50%' : `${Number(theme.shape.borderRadius) * 0.6}px`)

export const getIconSx = (
    theme: Theme,
    variant: CheckboxVariant,
    radius: number | string
) => ({
    borderRadius: radius,
    border: `1.5px solid ${theme.palette.mode === 'dark' ? theme.palette.grey[300] : theme.palette.divider}`,
    backgroundColor:
        variant === 'filled'
            ? theme.palette.background.paper
            : 'transparent',
})
