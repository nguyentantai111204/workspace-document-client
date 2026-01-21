import { Paper } from '@mui/material'

export const AuthCard: React.FC<React.PropsWithChildren> = ({ children }) => {
    return (
        <Paper
            elevation={12}
            sx={{
                width: '100%',
                p: 4,
                borderRadius: 3,
                bgcolor: 'background.paper',
                color: 'text.primary',
            }}
        >
            {children}
        </Paper>
    )
}
