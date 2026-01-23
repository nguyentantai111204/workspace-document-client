import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store, persistor } from './redux/store.redux'
import { PersistGate } from 'redux-persist/integration/react'

import App from './App.tsx'
import '../public/css/global.css'
import './common/utils/dayjs.utils.ts'

import { ThemeModeProvider } from './contexts/theme-mode.context.tsx'
import { AppThemeProvider } from './providers/theme.provider.tsx'
import { TimeProvider } from './providers/time-ago.provider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeModeProvider>
          <AppThemeProvider>
            <TimeProvider>
              <App />
            </TimeProvider>
          </AppThemeProvider>
        </ThemeModeProvider>
      </PersistGate>
    </Provider>
  </StrictMode>,
)
