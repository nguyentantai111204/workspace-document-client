import type { RouteObject } from 'react-router-dom'
import { authRoutes } from './auth.routes'
import { appRoutes } from './app.routes'

export const routesConfig: RouteObject[] = [
    authRoutes,
    appRoutes,
]
