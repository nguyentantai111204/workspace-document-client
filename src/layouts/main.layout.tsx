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
    '/profile': [
        { label: 'Trang chủ', href: '/' },
        { label: 'Hồ sơ' }
    ],
}

export const MainLayout = () => {
    const location = useLocation()

    const breadcrumbs = useMemo(() => {
        if (location.pathname.startsWith('/workspace')) {
            return [
                { label: 'Trang chủ', href: '/' },
                { label: 'Dự án' }
            ]
        }

        return BREADCRUMB_MAP[location.pathname] || [{ label: 'Trang chủ' }]
    }, [location.pathname])


    return (
        <Box sx={{
            display: 'flex',
            minHeight: '100vh',
            overflow: 'hidden',
            bgcolor: 'background.default',
            transition: (theme) => theme.transitions.create('background-color', {
                duration: theme.transitions.duration.standard,
            })
        }}>
            <HeaderLayout
                breadcrumbs={breadcrumbs}
            />
            <SidebarLayout />
            <MainStyle>
                <Outlet />
            </MainStyle>
        </Box>
    )
}
