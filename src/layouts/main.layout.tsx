import { Outlet, useLocation } from 'react-router-dom'
import { Box, styled } from '@mui/material'
import { HeaderLayout } from './dashboard/header.layout'
import { SidebarLayout } from './dashboard/sidebar.layout'
import type { BreadcrumbItem } from '../components/breadcrumb/breadcrumb.component'
import { useMemo } from 'react'
import { APP_BAR_DESKTOP, APP_BAR_MOBILE } from '../common/constant/style.constant'


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

const BREADCRUMB_MAP: Record<string, BreadcrumbItem[]> = {
    '/workspace': [{ label: 'Workspace' }],
}

export const MainLayout = () => {
    const location = useLocation()

    const breadcrumbs = useMemo(() => {
        return BREADCRUMB_MAP[location.pathname] || [{ label: 'Workspace' }]
    }, [location.pathname])

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
