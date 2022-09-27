import './index.css'
import 'flowbite/dist/flowbite.css'

import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import Router from './Router'
import { AlertContainer } from './components/alerts/AlertContainer'
import { AlertProvider } from './context/AlertContext'

const container = document.getElementById('root')
const root = createRoot(container!)

root.render(
  <BrowserRouter>
    <AlertProvider>
      <AlertContainer />
      <Router />
    </AlertProvider>
  </BrowserRouter>
)
