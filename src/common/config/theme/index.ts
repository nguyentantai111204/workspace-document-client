import { createTheme } from '@mui/material/styles'

import { typography } from './typography.config'
import { shape } from './shape.config'
import { shadows } from './shadow.config'
import { components } from './components'
import { basePalette, darkPalette, lightPalette } from './palete.config'

export const createAppTheme = (mode: 'light' | 'dark') =>
    createTheme({
        palette: {
            ...basePalette,
            ...(mode === 'dark' ? darkPalette : lightPalette),
        },
        typography,
        shape,
        shadows,
        components,
    })
