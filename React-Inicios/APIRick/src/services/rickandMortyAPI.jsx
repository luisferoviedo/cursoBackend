export async function getCharacters() {
  // Hace la petición al endpoint base de personajes.
  const response = await fetch('https://rickandmortyapi.com/api/character')

  // Si la API responde con error HTTP (4xx/5xx), cortamos y lanzamos error controlado.
  if (!response.ok) {
    throw new Error('No se pudieron obtener los personajes')
  }

  // Convertimos la respuesta a JSON y devolvemos solo el array que usamos en UI.
  const data = await response.json()
  return data.results ?? []
}
