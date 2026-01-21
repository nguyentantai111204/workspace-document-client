import { createTheme } from '@mui/material/styles'
import { ThemeMode, getSystemPaletteMode } from './mode.constant'
import { darkPalette } from './palete.dark.constant'
import { lightPalette } from './palete.light.constant'
import { typography } from './typography.constant'

export const buildTheme = (mode: ThemeMode) => {
    const resolvedMode =
        mode === ThemeMode.LIGHT ? getSystemPaletteMode() : mode

    return createTheme({
        palette: resolvedMode === 'dark' ? darkPalette : lightPalette,
        shape: {
            borderRadius: 10,
        },
        typography,
    })
}
