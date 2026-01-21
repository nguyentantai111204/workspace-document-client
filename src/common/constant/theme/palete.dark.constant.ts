// src/common/constants/theme/palette.dark.ts

import type { PaletteOptions } from '@mui/material/styles'
import { OPACITY } from './opacity.constant'
import { withAlpha } from './alpha.helper'
import { GREEN, NEUTRAL, SEMANTIC } from './colors.constant'

export const darkPalette: PaletteOptions = {
    mode: 'dark',

    primary: {
        main: GREEN[400],
        light: GREEN[300],
        dark: GREEN[500],
        contrastText: NEUTRAL[900],
    },

    background: {
        default: '#0b1220',
        paper: '#111827',
    },

    text: {
        primary: NEUTRAL[100],
        secondary: NEUTRAL[400],
        disabled: NEUTRAL[600],
    },

    divider: 'rgba(255,255,255,0.08)',

    action: {
        hover: withAlpha(GREEN[400], 0.12),
        selected: withAlpha(GREEN[400], 0.18),
        disabledOpacity: OPACITY.disabled,
    },

    success: SEMANTIC.success,
    warning: SEMANTIC.warning,
    error: SEMANTIC.error,
    info: SEMANTIC.info,
}
