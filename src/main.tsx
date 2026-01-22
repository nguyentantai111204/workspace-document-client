import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store, persistor } from './redux/store.redux'
import { PersistGate } from 'redux-persist/integration/react'

import App from './App.tsx'
import '../public/css/global.css'

import { AppThemeProvider } from './providers/theme-provider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppThemeProvider>
          <App />
        </AppThemeProvider>
      </PersistGate>
    </Provider>
  </StrictMode>,
)
