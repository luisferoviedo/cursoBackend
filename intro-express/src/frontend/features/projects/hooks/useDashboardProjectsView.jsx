import { useState } from 'react'
import { getApiErrorMessage } from '../../../lib/api'
import { toast } from 'sonner'
import {
  getProjectSummary,
  getVisibleProjects
} from '../utils/projects-view.jsx'

function getInitialProjectFormData() {
  return {
    name: '',
    description: '',
    status: 'pending'
  }
}

function useDashboardProjectsView({ projects, onCreateProject, onDeleteProject }) {
  const [formData, setFormData] = useState(getInitialProjectFormData)
  const [formError, setFormError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState(null)
  const [isDeletingProject, setIsDeletingProject] = useState(false)
  const [projectQuery, setProjectQuery] = useState('')
  const [projectStatusFilter, setProjectStatusFilter] = useState('all')
  const [projectSortBy, setProjectSortBy] = useState('attention')

  const summary = getProjectSummary(projects)
  const sortedProjects = getVisibleProjects(
    projects,
    projectQuery,
    projectStatusFilter,
    projectSortBy
  )

  function handleChange(event) {
    const { name, value } = event.target

    setFormData((currentData) => ({
      ...currentData,
      [name]: value
    }))

    setFormError('')
  }

  async function handleProjectDelete() {
    if (!projectToDelete) {
      return
    }

    try {
      setIsDeletingProject(true)
      await onDeleteProject(projectToDelete.id)
      toast.success('Proyecto eliminado correctamente')
      setProjectToDelete(null)
    } catch (error) {
      if (error?.response?.status === 403) {
        toast.error('No tienes permisos para eliminar este proyecto')
        return
      }

      toast.error(getApiErrorMessage(error, 'No pudimos eliminar el proyecto'))
    } finally {
      setIsDeletingProject(false)
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!formData.name.trim()) {
      setFormError('Escribe un nombre para el proyecto')
      return
    }

    try {
      setIsSubmitting(true)
      setFormError('')

      await onCreateProject({
        name: formData.name.trim(),
        description: formData.description.trim(),
        status: formData.status
      })

      setFormData(getInitialProjectFormData())
      toast.success('Proyecto creado correctamente')
    } catch (error) {
      setFormError(getApiErrorMessage(error, 'No pudimos crear el proyecto'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    ...summary,
    formData,
    formError,
    isSubmitting,
    projectToDelete,
    isDeletingProject,
    projectQuery,
    projectStatusFilter,
    projectSortBy,
    sortedProjects,
    setProjectToDelete,
    setProjectQuery,
    setProjectStatusFilter,
    setProjectSortBy,
    handleChange,
    handleProjectDelete,
    handleSubmit
  }
}

export default useDashboardProjectsView
