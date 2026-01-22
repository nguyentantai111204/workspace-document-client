import { BrowserRouter } from 'react-router-dom'
import { RenderRoutes } from './router/render-routes'
import { routesConfig } from './router/routes.config'
import { GlobalSnackbar } from './components/snackbar/global-snackbar.component'

export default function App() {
  return (
    <BrowserRouter>
      <RenderRoutes routes={routesConfig} />
      <GlobalSnackbar />
    </BrowserRouter>
  )
}
