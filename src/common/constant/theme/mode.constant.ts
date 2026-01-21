import type { PaletteMode } from '@mui/material'

export const ThemeMode = {
    LIGHT: 'light',
    DARK: 'dark',
} as const

export type ThemeMode = typeof ThemeMode[keyof typeof ThemeMode]

export const DEFAULT_THEME_MODE: ThemeMode = ThemeMode.LIGHT

export const getSystemPaletteMode = (): PaletteMode => {
    if (typeof window === 'undefined') return 'light'

    return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
}
