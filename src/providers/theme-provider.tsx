import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import { createAppTheme } from '../common/config/theme'
import { ReactNode, useMemo } from 'react'
import { StyledEngineProvider } from '@mui/material/styles'


interface AppThemeProviderProps {
    children: ReactNode
}

export const AppThemeProvider = ({ children }: AppThemeProviderProps) => {
    // TODO: Connect to Redux or Context for theme mode (light/dark)
    const mode = 'light'

    const theme = useMemo(() => createAppTheme(mode), [mode])

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </StyledEngineProvider>
    )
}
