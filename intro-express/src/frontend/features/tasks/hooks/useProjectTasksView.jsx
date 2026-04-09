import { useEffect, useState } from 'react'
import { api, getApiErrorMessage } from '../../../lib/api'
import { toast } from 'sonner'
import {
  getTaskSummary,
  getVisibleTasks
} from '../utils/tasks-view.jsx'

function getInitialTaskFormData() {
  return {
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium'
  }
}

function getTaskEditFormData(task) {
  return {
    title: task.title ?? '',
    description: task.description ?? '',
    status: task.status ?? 'pending',
    priority: task.priority ?? 'medium'
  }
}

function useProjectTasksView(numericProjectId) {
  const [project, setProject] = useState(null)
  const [projectError, setProjectError] = useState('')
  const [isLoadingProject, setIsLoadingProject] = useState(false)

  const [tasks, setTasks] = useState([])
  const [tasksError, setTasksError] = useState('')
  const [isLoadingTasks, setIsLoadingTasks] = useState(false)
  const [taskFormData, setTaskFormData] = useState(getInitialTaskFormData)
  const [taskFormError, setTaskFormError] = useState('')
  const [isSubmittingTask, setIsSubmittingTask] = useState(false)
  const [editingTaskId, setEditingTaskId] = useState(null)
  const [editTaskFormData, setEditTaskFormData] = useState(getInitialTaskFormData)
  const [editTaskError, setEditTaskError] = useState('')
  const [isUpdatingTask, setIsUpdatingTask] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState(null)
  const [isDeletingTask, setIsDeletingTask] = useState(false)
  const [taskQuery, setTaskQuery] = useState('')
  const [taskStatusFilter, setTaskStatusFilter] = useState('all')
  const [taskPriorityFilter, setTaskPriorityFilter] = useState('all')
  const [taskSortBy, setTaskSortBy] = useState('priority')

  const summary = getTaskSummary(tasks)
  const sortedTasks = getVisibleTasks(
    tasks,
    taskQuery,
    taskStatusFilter,
    taskPriorityFilter,
    taskSortBy
  )

  useEffect(() => {
    if (!Number.isInteger(numericProjectId) || numericProjectId <= 0) {
      setProject(null)
      setProjectError('El proyecto que buscas no es valido')
      setTasks([])
      setTasksError('')
      setIsLoadingProject(false)
      setIsLoadingTasks(false)
      return
    }

    // Reiniciamos el estado visible antes de cargar otro proyecto para evitar
    // que se mezclen tareas o métricas del proyecto anterior durante la transición.
    setProject(null)
    setProjectError('')
    setTasks([])
    setTasksError('')

    loadProject(numericProjectId)
    loadTasks(numericProjectId)
  }, [numericProjectId])

  useEffect(() => {
    setTaskFormData(getInitialTaskFormData())
    setTaskFormError('')
    setEditingTaskId(null)
    setEditTaskFormData(getInitialTaskFormData())
    setEditTaskError('')
    setTaskToDelete(null)
    setTaskQuery('')
    setTaskStatusFilter('all')
    setTaskPriorityFilter('all')
    setTaskSortBy('priority')
  }, [numericProjectId])

  async function loadProject(currentProjectId) {
    try {
      setIsLoadingProject(true)
      setProjectError('')

      const { data } = await api.get(`/projects/${currentProjectId}`)
      setProject(data)
    } catch (error) {
      setProject(null)
      setProjectError(getApiErrorMessage(error, 'No pudimos cargar este proyecto'))
    } finally {
      setIsLoadingProject(false)
    }
  }

  async function loadTasks(currentProjectId) {
    try {
      setIsLoadingTasks(true)
      setTasksError('')

      const { data } = await api.get(`/projects/${currentProjectId}/tasks`)
      setTasks(data)
    } catch (error) {
      setTasks([])
      setTasksError(getApiErrorMessage(error, 'No pudimos cargar las tareas de este proyecto'))
    } finally {
      setIsLoadingTasks(false)
    }
  }

  function handleTaskChange(event) {
    const { name, value } = event.target

    setTaskFormData((currentData) => ({
      ...currentData,
      [name]: value
    }))

    setTaskFormError('')
  }

  function handleEditTaskChange(event) {
    const { name, value } = event.target

    setEditTaskFormData((currentData) => ({
      ...currentData,
      [name]: value
    }))

    setEditTaskError('')
  }

  function startTaskEditing(task) {
    setEditingTaskId(task.id)
    setEditTaskFormData(getTaskEditFormData(task))
    setEditTaskError('')
  }

  function cancelTaskEditing() {
    setEditingTaskId(null)
    setEditTaskFormData(getInitialTaskFormData())
    setEditTaskError('')
  }

  async function handleTaskSubmit(event) {
    event.preventDefault()

    if (!taskFormData.title.trim()) {
      setTaskFormError('Escribe un nombre para la tarea')
      return
    }

    try {
      setIsSubmittingTask(true)
      setTaskFormError('')

      await api.post(`/projects/${numericProjectId}/tasks`, {
        title: taskFormData.title.trim(),
        description: taskFormData.description.trim(),
        status: taskFormData.status,
        priority: taskFormData.priority
      })

      setTaskFormData(getInitialTaskFormData())
      await loadTasks(numericProjectId)
      toast.success('Tarea creada correctamente')
    } catch (error) {
      setTaskFormError(getApiErrorMessage(error, 'No pudimos crear la tarea'))
    } finally {
      setIsSubmittingTask(false)
    }
  }

  async function handleTaskUpdateSubmit(event) {
    event.preventDefault()

    if (editingTaskId === null) {
      setEditTaskError('Selecciona una tarea valida para editar')
      return
    }

    if (!editTaskFormData.title.trim()) {
      setEditTaskError('Escribe un nombre para la tarea')
      return
    }

    try {
      setIsUpdatingTask(true)
      setEditTaskError('')

      await api.put(`/projects/${numericProjectId}/tasks/${editingTaskId}`, {
        title: editTaskFormData.title.trim(),
        description: editTaskFormData.description.trim(),
        status: editTaskFormData.status,
        priority: editTaskFormData.priority
      })

      await loadTasks(numericProjectId)
      cancelTaskEditing()
      toast.success('Tarea actualizada correctamente')
    } catch (error) {
      setEditTaskError(getApiErrorMessage(error, 'No pudimos actualizar la tarea'))
    } finally {
      setIsUpdatingTask(false)
    }
  }

  async function handleTaskDelete() {
    if (!taskToDelete) {
      return
    }

    try {
      setIsDeletingTask(true)
      await api.delete(`/projects/${numericProjectId}/tasks/${taskToDelete.id}`)

      if (editingTaskId === taskToDelete.id) {
        cancelTaskEditing()
      }

      await loadTasks(numericProjectId)
      setTaskToDelete(null)
      toast.success('Tarea eliminada correctamente')
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'No pudimos eliminar la tarea'))
    } finally {
      setIsDeletingTask(false)
    }
  }

  return {
    ...summary,
    project,
    projectError,
    isLoadingProject,
    tasks,
    tasksError,
    isLoadingTasks,
    taskFormData,
    taskFormError,
    isSubmittingTask,
    editingTaskId,
    editTaskFormData,
    editTaskError,
    isUpdatingTask,
    taskToDelete,
    isDeletingTask,
    taskQuery,
    taskStatusFilter,
    taskPriorityFilter,
    taskSortBy,
    sortedTasks,
    setTaskToDelete,
    setTaskQuery,
    setTaskStatusFilter,
    setTaskPriorityFilter,
    setTaskSortBy,
    handleTaskChange,
    handleEditTaskChange,
    startTaskEditing,
    cancelTaskEditing,
    handleTaskSubmit,
    handleTaskUpdateSubmit,
    handleTaskDelete
  }
}

export default useProjectTasksView
