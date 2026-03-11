function TaskForm({ text, onTextChange, onSubmit }) {
  return (
    <form className="task-form" onSubmit={onSubmit}>
      <label className="sr-only" htmlFor="new-task-input">
        Nueva tarea
      </label>
      <input
        id="new-task-input"
        type="text"
        placeholder="Que haremos hoy..."
        value={text}
        onChange={(event) => onTextChange(event.target.value)}
      />
      <button className="task-form__submit" type="submit">
        Agregar
      </button>
    </form>
  )
}

export default TaskForm
