function TaskList({
  tasks,
  selectedTaskId,
  emptyMessage,
  onToggleTask,
  onSelectTask,
  onDeleteTask,
}) {
  if (tasks.length === 0) {
    return <p className="empty">{emptyMessage}</p>
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li
          key={task.id}
          className={selectedTaskId === task.id ? 'task-item active' : 'task-item'}
        >
          <input
            aria-label={`Marcar ${task.text}`}
            type="checkbox"
            checked={task.done}
            onChange={() => onToggleTask(task.id)}
          />
          <button
            type="button"
            className="task-select"
            onClick={() => onSelectTask(task.id)}
          >
            <span>{task.text}</span>
          </button>

           <button
            type="button"
            className="task-delete"
            onClick={() => onDeleteTask(task.id)}
            aria-label={`Eliminar ${task.text}`}
          >
            Eliminar
          </button>
        </li>
      ))}
    </ul>
  )
}

export default TaskList
