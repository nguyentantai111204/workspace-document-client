import { Outlet } from 'react-router-dom'
import { Box, styled } from '@mui/material'
import { HeaderLayout } from './dashboard/header.layout'
import { SidebarLayout } from './dashboard/sidebar.layout'

const APP_BAR_MOBILE = 64
const APP_BAR_DESKTOP = 72

const MainStyle = styled('main')(({ theme }) => ({
    flexGrow: 1,
    minHeight: '100%',
    paddingTop: APP_BAR_MOBILE + 24,
    paddingBottom: theme.spacing(10),
    [theme.breakpoints.up('lg')]: {
        paddingTop: APP_BAR_DESKTOP + 24,
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
    },
}))

export const MainLayout = () => {
    const breadcrumbs = [
        { label: 'Home', href: '/' },
        { label: 'Dashboard' },
    ]

    const handleSearch = (value: string) => {
        console.log('Searching:', value)
    }

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', overflow: 'hidden' }}>
            <HeaderLayout
                breadcrumbs={breadcrumbs}
                searchPlaceholder="Tìm kiếm tài liệu, người dùng..."
                onSearch={handleSearch}
                showSearch={true}
            />
            <SidebarLayout />
            <MainStyle>
                <Outlet />
            </MainStyle>
        </Box>
    )
}
