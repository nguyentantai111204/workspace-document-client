import type { RouteObject } from 'react-router-dom'
import { MainLayout } from '../layouts/main.layout'

const DashboardPage = () => {
    return <div>Dashboard works 🎉</div>
}

export const appRoutes: RouteObject = {
    path: '/',
    element: <MainLayout />,
    children: [
        {
            index: true,
            element: <DashboardPage />,
        },
    ],
}
