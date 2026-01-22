import { Paper } from '@mui/material'

export const AuthCard: React.FC<React.PropsWithChildren> = ({ children }) => {
    return (
        <Paper
            elevation={0}
            sx={{
                width: '100%',
                p: { xs: 3, sm: 4, md: 5 },
                borderRadius: { xs: 2, sm: 3 },
                bgcolor: 'background.paper',
                color: 'text.primary',
                boxShadow: '0px 8px 24px rgba(149, 157, 165, 0.2)',
            }}
        >
            {children}
        </Paper>
    )
}
