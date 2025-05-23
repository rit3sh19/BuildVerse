import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createTheme } from '@mui/material/styles'
import './index.css'
import { ThemeProvider } from '@mui/material/styles'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import React from 'react'
import { AuthProvider } from './context/AuthContext.tsx'





const theme = createTheme({
  typography: {fontFamily: 'Roboto, sans-serif',allVariants:{color:'#000'}},
  
})
createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
   <AuthProvider> 
    <BrowserRouter>
    <ThemeProvider theme={theme}>
    <App />
    </ThemeProvider>
    </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>,
)
