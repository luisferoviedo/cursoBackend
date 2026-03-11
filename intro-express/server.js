const express = require('express')

const app = express()

const PORT = process.env.PORT || 3000

// "/" ruta barra o ruta raiz 127.0.0.1
app.get("/", (req, res) => {
  res.send('Bienvenidos a mi aplicacion web!')
})

app.get("/projects", (req,res) => {
  res.send("Pagina de proyectos")

})

app.use((req, res) => {
  res.status(404).send("Ruta no encontrada. Usa / o /projects")
})

app.listen(PORT, () => {
  console.log(`Servidor ejecutandose en http://localhost:${PORT}`)
}
)
