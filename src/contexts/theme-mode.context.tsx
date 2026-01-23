import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

type ThemeMode = 'light' | 'dark'

interface ThemeModeContextValue {
    mode: ThemeMode
    toggleMode: () => void
    setMode: (mode: ThemeMode) => void
}

const ThemeModeContext = createContext<ThemeModeContextValue | undefined>(undefined)

const STORAGE_KEY = 'workspace-theme-mode'

const getInitialMode = (): ThemeMode => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored === 'light' || stored === 'dark') {
            return stored
        }
    } catch (error) {
        console.warn('Failed to read theme mode from localStorage:', error)
    }
    return 'light'
}

export const ThemeModeProvider = ({ children }: { children: ReactNode }) => {
    const [mode, setModeState] = useState<ThemeMode>(getInitialMode)

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, mode)
        } catch (error) {
            console.warn('Failed to save theme mode to localStorage:', error)
        }
    }, [mode])

    const toggleMode = () => {
        setModeState((prevMode) => (prevMode === 'light' ? 'dark' : 'light'))
    }

    const setMode = (newMode: ThemeMode) => {
        setModeState(newMode)
    }

    return (
        <ThemeModeContext.Provider value={{ mode, toggleMode, setMode }}>
            {children}
        </ThemeModeContext.Provider>
    )
}

export const useThemeMode = () => {
    const context = useContext(ThemeModeContext)
    if (!context) {
        throw new Error('useThemeMode must be used within ThemeModeProvider')
    }
    return context
}
