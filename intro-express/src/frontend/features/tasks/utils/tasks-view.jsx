export function getTaskStatusBadgeVariant(status) {
  switch (status) {
    case 'done':
      return 'success'
    case 'in_progress':
      return 'info'
    default:
      return 'warning'
  }
}

export function getTaskPriorityBadgeVariant(priority) {
  switch (priority) {
    case 'high':
      return 'destructive'
    case 'low':
      return 'default'
    default:
      return 'violet'
  }
}

export function getTaskSummary(tasks = []) {
  const totalTasks = tasks.length
  const pendingTasks = tasks.filter((task) => task.status === 'pending').length
  const inProgressTasks = tasks.filter((task) => task.status === 'in_progress').length
  const completedTasks = tasks.filter((task) => task.status === 'done').length
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  return {
    totalTasks,
    pendingTasks,
    inProgressTasks,
    completedTasks,
    completionRate,
    taskSummaryItems: [
      {
        label: 'Pendientes',
        value: pendingTasks,
        percentage: totalTasks > 0 ? Math.round((pendingTasks / totalTasks) * 100) : 0,
        dotClassName: 'bg-[#e9b96e]',
        barClassName: 'bg-[#e9b96e]'
      },
      {
        label: 'En progreso',
        value: inProgressTasks,
        percentage: totalTasks > 0 ? Math.round((inProgressTasks / totalTasks) * 100) : 0,
        dotClassName: 'bg-[#76a9e0]',
        barClassName: 'bg-[#76a9e0]'
      },
      {
        label: 'Completadas',
        value: completedTasks,
        percentage: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
        dotClassName: 'bg-[#69b88a]',
        barClassName: 'bg-[#69b88a]'
      }
    ]
  }
}

export function getVisibleTasks(tasks, taskQuery, taskStatusFilter, taskPriorityFilter, taskSortBy) {
  const filteredTasks = tasks.filter((task) => {
    const matchesQuery =
      task.title.toLowerCase().includes(taskQuery.toLowerCase()) ||
      (task.description ?? '').toLowerCase().includes(taskQuery.toLowerCase())
    const matchesStatus = taskStatusFilter === 'all' || task.status === taskStatusFilter
    const matchesPriority = taskPriorityFilter === 'all' || task.priority === taskPriorityFilter

    return matchesQuery && matchesStatus && matchesPriority
  })

  return [...filteredTasks].sort((leftTask, rightTask) => {
    const priorityOrder = {
      high: 0,
      medium: 1,
      low: 2
    }
    const statusOrder = {
      in_progress: 0,
      pending: 1,
      done: 2
    }

    if (taskSortBy === 'recent') {
      return rightTask.id - leftTask.id
    }

    if (taskSortBy === 'title') {
      return leftTask.title.localeCompare(rightTask.title)
    }

    if (taskSortBy === 'status') {
      const statusDifference = statusOrder[leftTask.status] - statusOrder[rightTask.status]

      if (statusDifference !== 0) {
        return statusDifference
      }

      return rightTask.id - leftTask.id
    }

    const priorityDifference = priorityOrder[leftTask.priority] - priorityOrder[rightTask.priority]

    if (priorityDifference !== 0) {
      return priorityDifference
    }

    const statusDifference = statusOrder[leftTask.status] - statusOrder[rightTask.status]

    if (statusDifference !== 0) {
      return statusDifference
    }

    return rightTask.id - leftTask.id
  })
}
