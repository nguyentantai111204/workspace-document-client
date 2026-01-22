import type { RouteObject } from 'react-router-dom'
import { MainLayout } from '../layouts/main.layout'
import { ProtectedRoute } from './protected.route'

const DashboardPage = () => {
    return <div>Dashboard works 🎉</div>
}

export const appRoutes: RouteObject = {
    path: '/',
    element: <ProtectedRoute />,
    children: [
        {
            element: <MainLayout />,
            children: [
                {
                    index: true,
                    element: <DashboardPage />,
                },
            ],
        },
    ],
}
