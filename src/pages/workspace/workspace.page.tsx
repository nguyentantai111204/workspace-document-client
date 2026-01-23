import { Box, Container, Typography, useTheme } from '@mui/material'

export const WorkspacePage = () => {
    const theme = useTheme()

    return (
        <Container maxWidth="xl">
            <Box sx={{ py: 3 }}>
                <Box
                    sx={{
                        mt: 4,
                        p: 4,
                        borderRadius: 3,
                        bgcolor: theme.palette.mode === 'dark'
                            ? 'rgba(255, 255, 255, 0.05)'
                            : 'rgba(0, 0, 0, 0.02)',
                        border: `1px dashed ${theme.palette.divider}`,
                        textAlign: 'center'
                    }}
                >
                    <Typography variant="h6" color="text.secondary">
                        🚀 Workspace Content Coming Soon
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Đây là nơi bạn sẽ quản lý documents, projects, và collaborators.
                    </Typography>
                </Box>
            </Box>
        </Container>
    )
}
