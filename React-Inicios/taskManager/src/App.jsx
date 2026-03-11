import { useEffect, useMemo, useState } from "react"
import FilterBar from './components/FilterBar'
import NotesPanel from './components/NotesPanel'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'

// Punto único de persistencia para no repetir strings "mágicos".
const STORAGE_KEY = 'task-manager-tasks'
const FILTERS = {
  all: 'Todas',
  pending: 'Pendientes',
  completed: 'Completadas',
}

// Input contract mínimo para aceptar una tarea desde almacenamiento.
const isValidTask = (task) => (
  typeof task?.id === 'number'
  && typeof task?.text === 'string'
  && typeof task?.done === 'boolean'
)

// Contrato de red URL

const API_URL = "https://tasklistapi.vercel.app/tasks/";
const API_TOKEN = "react-students-token";

async function fetchTasks() {
  const response = await fetch(API_URL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Error ${response.status}: no se pudieron obtener tareas`);
  }

  const data = await response.json();
  const tasksFromApi = Array.isArray(data) ? data : [data];
  return tasksFromApi.map(mapApiTaskToLocalTask);
}

function mapApiTaskToLocalTask(apiTask) {
  const normalizedStatus = String(apiTask.status || '').toLowerCase().trim()
  return {
    id: apiTask.id,
    text: apiTask.title?.trim() || 'Sin título',
    done: normalizedStatus === 'done' || normalizedStatus === 'completed',
    notes: apiTask.description?.trim() || '',
    priority: apiTask.priority || 'medium',
    emoji: apiTask.emoji || '',
  }
}

// INPUTS -> localStorage (texto JSON)
// PROCESS -> parsear, validar y sanitizar
// OUTPUT -> tasks seguras + mensaje para UI
const getStoredTasks = () => {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (!saved) return { tasks: [], error: '' }

  try {
    const parsed = JSON.parse(saved)
    if (!Array.isArray(parsed)) {
      return { tasks: [], error: 'Se ignoraron datos guardados inválidos.' }
    }

    // Sanitización defensiva:
    // 1) sólo items válidos
    // 2) normalizar texto y notas
    // 3) descartar tareas vacías
    const safeTasks = parsed
      .filter(isValidTask)
      .map((task) => ({
        ...task,
        text: task.text.trim(),
        notes: typeof task.notes === 'string' ? task.notes : '',
      }))
      .filter((task) => task.text.length > 0)

    const wasSanitized = safeTasks.length !== parsed.length
    return {
      tasks: safeTasks,
      error: wasSanitized ? 'Algunas tareas antiguas se corrigieron automáticamente.' : '',
    }
  } catch (error) {
    console.error('Error leyendo tareas', error)
    return { tasks: [], error: 'No se pudieron cargar tus tareas guardadas.' }
  }
}

function App() {
  // Se lee almacenamiento una sola vez al montar para evitar trabajo repetido.
  const initialState = useMemo(() => getStoredTasks(), [])

  // Estado principal de la app: fuente de verdad para render + persistencia.
  const [tasks, setTasks] = useState(initialState.tasks)
  const [isFetchingTasks, setIsFetchingTasks] = useState(false)
  const [apiError, setApiError] = useState('')
  // Mensaje informativo que se calcula al inicio (no cambia durante la sesión).
  const [storageMessage] = useState(initialState.error)
  const [text, setText] = useState('')
  const [selectedTaskId, setSelectedTaskId] = useState(null)
  const [filter, setFilter] = useState('all')
  const [successMessage, setSuccessMessage] = useState('')
  const [isBootstrapping, setIsBootstrapping] = useState(true)

  // Derivado de estado: evita duplicar datos y reduce inconsistencias.
  const selectedTask = tasks.find((task) => task.id === selectedTaskId) || null

  // Estado de carga breve para evitar saltos visuales durante el montaje.
  useEffect(() => {
    const timerId = window.setTimeout(() => setIsBootstrapping(false), 180)
    return () => window.clearTimeout(timerId)
  }, [])

  // Sincronización React -> localStorage.
  // Cada cambio en tasks actualiza la copia persistida.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  }, [tasks])

  useEffect(() => {
    if (!successMessage) return undefined

    const timerId = window.setTimeout(() => setSuccessMessage(''), 2200)
    return () => window.clearTimeout(timerId)
  }, [successMessage])

  // INPUTS -> submit del formulario + text actual
  // PROCESS -> limpiar y validar texto
  // OUTPUT -> nueva tarea al inicio de la lista
  const handleSubmit = (event) => {
    event.preventDefault()
    const cleanText = text.trim()
    if (!cleanText) return

    const newTask = {
      id: Date.now(),
      text: cleanText,
      done: false,
      notes: '',
    }

    setTasks([newTask, ...tasks])
    setSelectedTaskId(newTask.id)
    setText('')
    setSuccessMessage('Tarea agregada correctamente.')
  }

  // Actualiza sólo notas de la tarea seleccionada.
  const handleNotesChange = (value) => {
    if (!selectedTaskId) return

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === selectedTaskId ? { ...task, notes: value } : task
      )
    )
  }

useEffect(() => {
  let isCancelled = false

  const loadTasksFromApi = async () => {
    try {
      setIsFetchingTasks(true)
      setApiError('')
      const apiTasks = await fetchTasks()
      if (!isCancelled) {
        setTasks((previousTasks) => {
          if (previousTasks.length === 0) return apiTasks

          const apiTaskIds = new Set(apiTasks.map((task) => task.id))
          const localOnlyTasks = previousTasks.filter((task) => !apiTaskIds.has(task.id))

          return [...localOnlyTasks, ...apiTasks]
        })
      }
    } catch (error) {
      if (!isCancelled) {
        setApiError('No se pudieron cargar tareas desde la API.')
      }
      console.error('Error cargando API', error)
    } finally {
      if (!isCancelled) {
        setIsFetchingTasks(false)
      }
    }
  }

  loadTasksFromApi()

  return () => {
    isCancelled = true
  }
}, [])


  // Toggle idempotente por id: cambia done sin tocar otras tareas.
  const handleToggleTask = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    )
  }

  //Toggle para eliminar tarea
  const handleDeleteTask = (id) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id))
    if (selectedTaskId === id) setSelectedTaskId(null)
    }

  // Derivado para presentación: separa lógica de filtro del render JSX.
  const filteredTasks = tasks.filter((task) => {
    if (filter === 'pending') return !task.done
    if (filter === 'completed') return task.done
    return true
  })

  // Estado vacío contextual para dar feedback claro según filtro activo.
  const emptyMessage = tasks.length === 0
    ? 'No tienes tareas todavía. Agrega la primera.'
    : `No hay tareas en "${FILTERS[filter]}".`

  if (isBootstrapping) {
    return (
      <main className="app">
        <section className="task-card">
          <p className="status-info">Cargando tu tablero...</p>
        </section>
      </main>
    )
  }

  return (
    <main className="app">
      <section className="task-card">
        <div className="board">
          <div className="task-column">
            <h1>Task Manager</h1>
            <p>No te preocupes, acá te recordamos todo:</p>

            {storageMessage && <p className="status-warning">{storageMessage}</p>}
            {successMessage && <p className="status-success">{successMessage}</p>}
            {isFetchingTasks && <p className="status-info">Cargando tareas desde la API...</p>}
            {apiError && <p className="status-warning">{apiError}</p>}

            <TaskForm
              text={text}
              onTextChange={setText}
              onSubmit={handleSubmit}
            />

            <FilterBar
              filters={FILTERS}
              selectedFilter={filter}
              onFilterChange={setFilter}
            />

            <TaskList
              tasks={filteredTasks}
              selectedTaskId={selectedTaskId}
              emptyMessage={emptyMessage}
              onToggleTask={handleToggleTask}
              onSelectTask={setSelectedTaskId}
              onDeleteTask={handleDeleteTask}
            />
          </div>

          <NotesPanel
            selectedTask={selectedTask}
            onNotesChange={handleNotesChange}
          />
        </div>
      </section>
    </main>
  )
}

export default App
