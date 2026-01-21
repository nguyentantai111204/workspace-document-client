import { Outlet } from 'react-router-dom'
import { Box } from '@mui/material'

export const MainLayout = () => {
    return (
        <Box minHeight="100vh" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Outlet />
        </Box>
    )
}
