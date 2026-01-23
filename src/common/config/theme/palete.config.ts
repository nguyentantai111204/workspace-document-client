import { alpha, type PaletteOptions } from '@mui/material/styles'

export const basePalette: PaletteOptions = {
    primary: {
        light: '#E3F2FD',
        main: '#2196F3',
        dark: '#1E88E5',
        800: '#1565C0',
    },

    secondary: {
        light: '#EDE7F6',
        main: '#673AB7', 
        dark: '#5E35B1',
        800: '#4527A0',
    },

    success: {
        light: '#B9F6CA',
        main: '#00E676',
        dark: '#00C853',
    },
    warning: {
        light: '#FBE9E7',
        main: '#FFAB91',
        dark: '#D84315',
    },
    error: {
        light: '#FCA5A5',
        main: '#DC2626',
        dark: '#B91C1C',
    },
    info: {
        light: '#E0F2FE',
        main: '#0EA5E9',
        dark: '#0369A1',
    },

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
        default: '#0A0E27', 
        paper: '#141B2D',   
    },
    text: {
        primary: '#F1F5F9',   
        secondary: '#94A3B8', 
        disabled: '#64748B',  
    },
    divider: alpha('#E2E8F0', 0.12), 

    primary: {
        main: '#60A5FA',   
        light: '#93C5FD',  
        dark: '#3B82F6',   
    },
    secondary: {
        main: '#A78BFA', 
        light: '#C4B5FD', 
        dark: '#8B5CF6',  
    },
}
