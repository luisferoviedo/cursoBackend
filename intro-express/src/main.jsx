import React from 'react'
import ReactDOM from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import './styles/app.css'
import App from './App'

// Punto de entrada del frontend: React toma el div#root del index.html
// y dibuja dentro de el toda la aplicacion.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
