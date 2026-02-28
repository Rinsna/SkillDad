import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import axios from 'axios'
import './index.css'
import './performance.css'
import App from './App.jsx'
import { ToastProvider } from './context/ToastContext'

// Configure axios base URL for entire app
// We use a hardcoded fallback for the Render server to ensure Vercel works even if env vars aren't set in the dashboard
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'https://skilldad-server.onrender.com'
console.log('API Base URL:', axios.defaults.baseURL)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastProvider>
      <App />
    </ToastProvider>
  </StrictMode>,
)
