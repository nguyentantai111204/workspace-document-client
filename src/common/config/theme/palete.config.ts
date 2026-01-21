import { alpha, type PaletteOptions } from '@mui/material/styles'

export const basePalette: PaletteOptions = {
    primary: {
        main: '#2563EB', // Blue-600
        light: '#3B82F6',
        dark: '#1E40AF',
    },

    secondary: {
        main: '#7C3AED', // Violet-600
    },

    success: { main: '#16A34A' },
    warning: { main: '#D97706' },
    error: { main: '#DC2626' },

    grey: {
        50: '#F9FAFB',
        100: '#F3F4F6',
        200: '#E5E7EB',
        300: '#D1D5DB',
        400: '#9CA3AF',
        500: '#6B7280',
        600: '#4B5563',
        700: '#374151',
        800: '#1F2937',
        900: '#111827',
    },

    divider: alpha('#111827', 0.12),

    text: {
        primary: '#111827',
        secondary: '#4B5563',
        disabled: '#9CA3AF',
    },
}

export const lightPalette: PaletteOptions = {
    mode: 'light',
    background: {
        default: '#F9FAFB',
        paper: '#FFFFFF',
    },
}

export const darkPalette: PaletteOptions = {
    mode: 'dark',
    background: {
        default: '#0F172A',
        paper: '#020617',
    },
    text: {
        primary: '#F9FAFB',
        secondary: '#CBD5E1',
    },
}
