import { Box, useTheme } from '@mui/material'

export const AuthBackground = () => {
    const theme = useTheme()
    const isDark = theme.palette.mode === 'dark'

    return (
        <Box
            sx={{
                minHeight: '100vh',
                backgroundImage: 'url(/assets/background/overlay.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative',
            }}
        >
            <Box
                sx={{
                    position: 'absolute',
                    inset: 0,
                    backdropFilter: 'blur(8px)',
                    background: isDark
                        ? `linear-gradient(
                180deg,
                rgba(15,23,42,0.75),
                rgba(15,23,42,0.95)
              )`
                        : `linear-gradient(
                180deg,
                rgba(59,130,246,0.25),
                rgba(15,23,42,0.55)
              )`,
                }}
            />
        </Box>
    )
}
