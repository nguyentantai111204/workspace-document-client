import { alpha, type PaletteOptions } from '@mui/material/styles'

export const basePalette: PaletteOptions = {
    primary: {
        light: '#E3F2FD', // Blue-50
        main: '#2196F3', // Blue-500
        dark: '#1E88E5', // Blue-600
        800: '#1565C0', // Blue-800
    },

    secondary: {
        light: '#EDE7F6', // DeepPurple-50
        main: '#673AB7', // DeepPurple-500
        dark: '#5E35B1', // DeepPurple-600
        800: '#4527A0', // DeepPurple-800
    },

    success: {
        light: '#B9F6CA',
        main: '#00E676',
        dark: '#00C853',
    },
    warning: {
        light: '#FBE9E7', // Orange light
        main: '#FFAB91', // Orange main
        dark: '#D84315', // Orange dark
    },
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
