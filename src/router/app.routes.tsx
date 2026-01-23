import type { RouteObject } from 'react-router-dom'
import { Navigate } from 'react-router-dom'
import { MainLayout } from '../layouts/main.layout'
import { ProtectedRoute } from './protected.route'
import { WorkspacePage } from '../pages/workspace/workspace.page'

export const appRoutes: RouteObject = {
    path: '/',
    element: <ProtectedRoute />,
    children: [
        {
            element: <MainLayout />,
            children: [
                {
                    index: true,
                    element: <Navigate to="/workspace" replace />,
                },
                {
                    path: 'workspace',
                    element: <WorkspacePage />,
                },
            ],
        },
    ],
}
