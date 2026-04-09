export function getProjectStatusBadgeVariant(status) {
  switch (status) {
    case 'done':
      return 'success'
    case 'in_progress':
      return 'info'
    default:
      return 'warning'
  }
}

export function getProjectSummary(projects = []) {
  const totalProjects = projects.length
  const pendingProjects = projects.filter((project) => project.status === 'pending').length
  const activeProjects = projects.filter((project) => project.status === 'in_progress').length
  const completedProjects = projects.filter((project) => project.status === 'done').length
  const completionRate = totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0

  return {
    totalProjects,
    pendingProjects,
    activeProjects,
    completedProjects,
    completionRate,
    projectSummaryItems: [
      {
        label: 'Pendientes',
        value: pendingProjects,
        percentage: totalProjects > 0 ? Math.round((pendingProjects / totalProjects) * 100) : 0,
        dotClassName: 'bg-[#e9b96e]',
        barClassName: 'bg-[#e9b96e]'
      },
      {
        label: 'En progreso',
        value: activeProjects,
        percentage: totalProjects > 0 ? Math.round((activeProjects / totalProjects) * 100) : 0,
        dotClassName: 'bg-[#76a9e0]',
        barClassName: 'bg-[#76a9e0]'
      },
      {
        label: 'Completados',
        value: completedProjects,
        percentage: totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0,
        dotClassName: 'bg-[#69b88a]',
        barClassName: 'bg-[#69b88a]'
      }
    ]
  }
}

export function getVisibleProjects(projects, projectQuery, projectStatusFilter, projectSortBy) {
  const filteredProjects = projects.filter((project) => {
    const matchesStatus = projectStatusFilter === 'all' || project.status === projectStatusFilter
    const matchesQuery =
      project.name.toLowerCase().includes(projectQuery.toLowerCase()) ||
      (project.description ?? '').toLowerCase().includes(projectQuery.toLowerCase())

    return matchesStatus && matchesQuery
  })

  return [...filteredProjects].sort((leftProject, rightProject) => {
    const projectStatusOrder = {
      in_progress: 0,
      pending: 1,
      done: 2
    }

    if (projectSortBy === 'name_asc') {
      return leftProject.name.localeCompare(rightProject.name)
    }

    if (projectSortBy === 'recent') {
      return rightProject.id - leftProject.id
    }

    const statusDifference =
      projectStatusOrder[leftProject.status] - projectStatusOrder[rightProject.status]

    if (statusDifference !== 0) {
      return statusDifference
    }

    return rightProject.id - leftProject.id
  })
}
