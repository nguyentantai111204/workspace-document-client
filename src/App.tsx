import { BrowserRouter } from 'react-router-dom'
import { RenderRoutes } from './router/render-routes'
import { routesConfig } from './router/routes.config'

export default function App() {
  return (
    <BrowserRouter>
      <RenderRoutes routes={routesConfig} />
    </BrowserRouter>
  )
}
