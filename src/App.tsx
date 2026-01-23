import { BrowserRouter } from 'react-router-dom'
import { RenderRoutes } from './router/render-routes'
import { routesConfig } from './router/routes.config'
import { GlobalSnackbar } from './components/snackbar/global-snackbar.component'
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from './redux/store.redux'
import { getProfile } from './redux/account/account.action'

const AuthInitializer = () => {
  const dispatch = useAppDispatch()
  const { isAuthenticated, token } = useAppSelector(state => state.account)

  useEffect(() => {
    if (isAuthenticated || token) {
      dispatch(getProfile())
    }
  }, [dispatch, isAuthenticated, token])

  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthInitializer />
      <RenderRoutes routes={routesConfig} />
      <GlobalSnackbar />
    </BrowserRouter>
  )
}
