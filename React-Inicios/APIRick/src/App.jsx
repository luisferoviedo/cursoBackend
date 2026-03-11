import { Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getCharacters } from './services/rickandMortyAPI'

function HomePage() {
  // Estado principal de datos y estados de UX.
  const [characters, setCharacters] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  // Estos estados guardan lo que el usuario escribe y selecciona para filtrar la lista sin tocar los datos originales.
  const [ searchTerm, setSearchTerm] = useState('')
  const [ statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    // Carga inicial al montar el componente.
    const loadCharacters = async () => {
      try {
        setLoading(true)
        setError('')
        const data = await getCharacters()
        setCharacters(data)
      } catch (err) {
        setError(err.message || 'Error inesperado')
      } finally {
        setLoading(false)
      }
    }

    loadCharacters()
  }, [])

  // A partir de la lista original, genero una version filtrada para renderizar solo los personajes que coinciden con la busqueda y el estado.
  const filteredCharacters = characters.filter((character) => {
    const matchesSearch = character.name
    ?.toLowerCase()
    .includes(searchTerm.toLowerCase())

    const matchesStatus =
    statusFilter === 'all' ||
    character.status?.toLowerCase() ===statusFilter

    return matchesSearch && matchesStatus
  })

  if (loading) return <p>Cargando...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <main className="page">
      <header className="hero">
        <p className="hero-kicker">Multiverse API</p>
        <h1>Rick and Morty Explorer</h1>
        <p className="hero-copy">
          Explora personajes del universo y sus variantes con una interfaz estilo sci-fi.
        </p>
      </header>
      {/* Este bloque le da mas control al usuario para explorar la informacion en lugar de solo verla estatica. */}
      <section className="filters" aria-label="Filtros de personajes">
        <div className="filter-group">
          <label htmlFor="search" className="filter-label">
            Buscar por nombre
          </label>
          <input
            id="search"
            type="text"
            className="filter-input"
            placeholder=" Ej: Rick, Morty, Summer..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="status" className="filter-label">
            Filtrar por estado
          </label>
          <select
            id="status"
            className="filter-select"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="all">Todos</option>
            <option value="alive">Alive</option>
            <option value="dead">Dead</option>
            <option value="unknown">Unknown</option>
          </select>
        </div>
      </section>
      {/* Este texto da feedback inmediato sobre cuantos resultados quedan despues de aplicar los filtros. */}
      <p className='results-summary'>
        Mostrando {filteredCharacters.length} personaje
        {filteredCharacters.length === 1 ? '' : `s`}
      </p> 

    {/* Si la busqueda no encuentra coincidencias, muestro un estado vacio para evitar una interfaz confusa o rota. */}
    {filteredCharacters.length === 0 ? (
      <section className='empty-state'>
        <h2>No encontramos personajes con este criterio</h2>
        <p>
          Prueba otro nombre o cambia el filtro de estado para ver mas resultados
        </p>
      </section>
    ) : (
      <>
      {/* Si si hay coincidencias, vuelvo a pintar la grilla con la lista ya filtrada. */}
      <section className='cards-grid'>
        {filteredCharacters.map((character) => (
          <article key={character.id} className="card">
            <img
              src={character.image}
              alt={character.name}
              className="card-image"
              loading="lazy"
              />
              <div className='card-body'>
                <p
                  className={`status-badge ${
                    character.status?.toLowerCase() === 'alive'
                    ? 'is-alive'
                    : character.status?.toLowerCase() === 'dead'
                      ? 'is-dead'
                      : 'is-unknown'
                  }`}
                  >
                    {character.status}
                  </p>
                  <h2 className="card-title">{character.name}</h2>
                  <p className="card-species">{character.species}</p>
                  <p className="card-origin">
                    <span>Origin:</span> {character.origin?.name}
                  </p>
              </div>
          </article>
        ))}
      </section>
      </>
    )}

    </main>
  )
}

function NotFoundPage() {
  return <h1>404 - Pagina no encontrada</h1>
}

function App() {
  return (
    // Router principal: Home y fallback 404.
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
