function NotesPanel({ selectedTask, onNotesChange }) {
  const taskEmoji = selectedTask?.emoji || '📝'
  const taskPriority = selectedTask?.priority || 'medium'

  return (
    <aside className="notes-column">
      <h2>Notas</h2>
      {selectedTask ? (
        <>
          <p>Tarea seleccionada: {selectedTask.text}</p>
          <p className="task-meta">
            <span className="task-meta__emoji">Emoji: {taskEmoji}</span>
            <span className={`task-meta__priority task-meta__priority--${taskPriority}`}>
              Prioridad: {taskPriority}
            </span>
          </p>
          <label className="sr-only" htmlFor="task-notes">
            Notas de la tarea seleccionada
          </label>
          <textarea
            id="task-notes"
            placeholder="Escribe notas para esta tarea..."
            value={selectedTask.notes || ''}
            onChange={(event) => onNotesChange(event.target.value)}
            rows={8}
          />
        </>
      ) : (
        <p>Selecciona una tarea para ver o escribir notas.</p>
      )}
    </aside>
  )
}

export default NotesPanel
