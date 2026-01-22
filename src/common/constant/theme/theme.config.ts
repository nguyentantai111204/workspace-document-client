import { createTheme } from '@mui/material/styles'
import { ThemeMode, getSystemPaletteMode } from './mode.constant'
import { darkPalette } from './palete.dark.constant'
import { lightPalette } from './palete.light.constant'
import { typography } from './typography.constant'
import { shadows } from '../../config/theme/shadow.config'

export const buildTheme = (mode: ThemeMode) => {
    const resolvedMode =
        mode === ThemeMode.LIGHT ? getSystemPaletteMode() : mode

    return createTheme({
        palette: resolvedMode === 'dark' ? darkPalette : lightPalette,
        shape: {
            borderRadius: 10,
        },
        typography,
        shadows,

    })
}
