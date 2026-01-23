import { Paper, useTheme } from '@mui/material'

export const AuthCard: React.FC<React.PropsWithChildren> = ({ children }) => {
    const theme = useTheme()

    return (
        <Paper
            elevation={0}
            sx={{
                width: '100%',
                p: { xs: 3, sm: 4, md: 5 },
                borderRadius: Number(theme.shape.borderRadius) * 3,
                bgcolor: 'background.paper',
                color: 'text.primary',
                boxShadow: theme.shadows[4],
            }}
        >
            {children}
        </Paper>
    )
}
