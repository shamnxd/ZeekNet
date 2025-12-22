import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import '@flaticon/flaticon-uicons/css/all/all.css'
import { Provider } from 'react-redux'
import { store } from './store/store'
import { GoogleOAuthProvider } from '@react-oauth/google'
import AuthProvider from './components/common/AuthProvider'
import { setAuthTokenGetter } from './api'

setAuthTokenGetter(() => store.getState().auth.token)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <GoogleOAuthProvider clientId="1008382492404-iijc7ifmsi895rk1aiu8ei8sdsjntdqd.apps.googleusercontent.com">
        <AuthProvider>
          <App />
        </AuthProvider>
      </GoogleOAuthProvider>
    </Provider>
  </React.StrictMode>,
)