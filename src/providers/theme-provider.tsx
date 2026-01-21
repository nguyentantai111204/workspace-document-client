import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import { createAppTheme } from '../common/config/theme'
import { useMemo, type ReactNode } from 'react'
import { StyledEngineProvider } from '@mui/material/styles'


interface AppThemeProviderProps {
    children: ReactNode
}

export const AppThemeProvider = ({ children }: AppThemeProviderProps) => {
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
