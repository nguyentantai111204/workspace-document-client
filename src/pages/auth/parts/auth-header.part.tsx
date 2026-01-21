
import { Box, Stack, Typography, useTheme } from '@mui/material'

export const AuthHeader = () => {
    const theme = useTheme()

    return (
        <Stack alignItems="center" mb={4} spacing={1}>
            <Box display="flex" alignItems="center" gap={1.5}>
                <Box
                    component="img"
                    src="/favicon.ico"
                    alt="DocWorkspace Logo"
                    sx={{
                        width: 42,
                        height: 42,
                        filter: `drop-shadow(0px 4px 6px ${theme.palette.primary.light}80)`,
                    }}
                />

                <Typography
                    variant="h3"
                    fontWeight={800}
                    sx={{
                        background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        backgroundClip: 'text',
                        textFillColor: 'transparent',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        letterSpacing: -0.5,
                    }}
                >
                    DocWorkspace
                </Typography>
            </Box>

            <Typography variant="body1" color="text.secondary" fontWeight={500}>
                Quản lý tài liệu thông minh & hiệu quả
            </Typography>
        </Stack>
    )
}
