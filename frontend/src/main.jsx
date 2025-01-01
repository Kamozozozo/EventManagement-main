import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { AuthContextProvider } from './components/context/AuthContext.jsx'
import HomeApp from './HomeApp.jsx'
import { Toaster } from 'react-hot-toast'
import { SocketContextProvider } from './components/context/SocketContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <AuthContextProvider>
      <SocketContextProvider>
      <App />
      </SocketContextProvider>
    </AuthContextProvider>
  </BrowserRouter>

  </StrictMode>,
)
