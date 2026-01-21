import type { PaletteOptions } from '@mui/material/styles'
import { OPACITY } from './opacity.constant'
import { withAlpha } from './alpha.helper'
import { GREEN, NEUTRAL, SEMANTIC } from './colors.constant'

export const lightPalette: PaletteOptions = {
    mode: 'light',

    primary: {
        main: GREEN[500],
        light: GREEN[400],
        dark: GREEN[600],
        contrastText: '#ffffff',
    },

    background: {
        default: NEUTRAL[50],
        paper: NEUTRAL[0],
    },

    text: {
        primary: NEUTRAL[900],
        secondary: NEUTRAL[600],
        disabled: NEUTRAL[400],
    },

    divider: withAlpha(NEUTRAL[900], OPACITY.divider),

    action: {
        hover: withAlpha(GREEN[500], OPACITY.hover),
        selected: withAlpha(GREEN[500], OPACITY.selected),
        disabledOpacity: OPACITY.disabled,
    },

    success: SEMANTIC.success,
    warning: SEMANTIC.warning,
    error: SEMANTIC.error,
    info: SEMANTIC.info,
}
