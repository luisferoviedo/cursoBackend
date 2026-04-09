// main.jsx
// Punto de entrada del frontend.
// Este archivo solo conecta React con el DOM y carga estilos globales.

import React from 'react'
import ReactDOM from 'react-dom/client'
import './styles/app.css'
import App from './App'
import { Toaster } from '@/components/ui/sonner'

// React toma el div#root del index.html
// y desde allí renderiza toda la SPA.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <Toaster />
  </React.StrictMode>
)
