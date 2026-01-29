import type { RouteObject } from 'react-router-dom'
import { MainLayout } from '../layouts/main.layout'
import { ProtectedRoute } from './protected.route'
import { mainRoutes } from './main.routes'

export const appRoutes: RouteObject = {
    path: '/',
    element: <ProtectedRoute />,
    children: [
        {
            element: <MainLayout />,
            children: mainRoutes,
        },
    ],
}
