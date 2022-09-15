import './index.css'
import 'flowbite/dist/flowbite.css'

import { Auth0Provider } from '@auth0/auth0-react'
import { createRoot } from 'react-dom/client'

import Auth from './Auth'
import { AlertContainer } from './components/alerts/AlertContainer'
import { AUDIENCE, CLIENT_ID, DOMAIN, SCOPE } from './constants/auth'
import { AlertProvider } from './context/AlertContext'

const container = document.getElementById('root')
const root = createRoot(container!)

root.render(
  <>
    <AlertProvider>
      <AlertContainer />
      <Auth0Provider
        domain={DOMAIN}
        clientId={CLIENT_ID}
        redirectUri={window.location.origin}
        audience={AUDIENCE}
        cacheLocation={'localstorage'}
        scope={SCOPE}
      >
        <Auth />
      </Auth0Provider>
    </AlertProvider>
  </>
)
