import { BrowserRouter } from 'react-router-dom'
import { RenderRoutes } from './router/render-routes'
import { routesConfig } from './router/routes.config'
import { GlobalSnackbar } from './components/snackbar/global-snackbar.component'
import { useAuthInitializer } from './hooks/use-auth-initializer.hook'

export default function App() {
  useAuthInitializer()

  return (
    <BrowserRouter>
      <RenderRoutes routes={routesConfig} />
      <GlobalSnackbar />
    </BrowserRouter>
  )
}
