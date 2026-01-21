// routes/auth.routes.tsx
import type { RouteObject } from 'react-router-dom'
import { AuthLayout } from '../common/layouts/auth/auth.layout'
import { SignUpScreen } from '../common/pages/auth/auth-screen/signup.screen'
import { LoginForm } from '../common/pages/auth/parts/auth-login/login.part'



export const authRoutes: RouteObject = {
  path: '/',
  element: <AuthLayout />,
  children: [
    {
      path: 'login',
      element: <LoginForm />,
    },
    {
      path: 'register',
      element: <SignUpScreen />,
    },
    {
      path: 'forgot-password',
    //   element: <ForgotPasswordScreen />,
    },
  ],
}
