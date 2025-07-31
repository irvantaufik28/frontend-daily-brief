import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { CookiesProvider } from 'react-cookie';
import store from '../src/store'
import 'bootstrap/dist/css/bootstrap.min.css';

import IndexRoutes from './routes/Index.Routes.js';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CookiesProvider>
      <Provider store={store}>
          <IndexRoutes />
      </Provider>
    </CookiesProvider>
  </StrictMode>,
)

