const express = require('express')
const { version } = require('react')

const app = express()

const PORT = process.env.PORT || 3000

// "/" ruta barra o ruta raiz 127.0.0.1
app.get("/", (req, res) => {
  res.send('Bienvenidos a mi aplicacion web!')
})
app.get("/api", (req, res) => {
  res.json({
    name: "Project Management System - API",
    version: "1.0.0",
    status: "running"
  })
}
)

app.listen(PORT, () => {
  console.log(`Servidor running http://localhost:${PORT}`)
}
)
