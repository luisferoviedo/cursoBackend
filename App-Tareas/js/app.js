// Referencias a elementos del DOM
const taskInput = document.querySelector("#taskInput");
const addTaskBtn = document.querySelector("#addTaskBtn");
const taskList = document.querySelector("#tasklist");
const totalCount = document.querySelector("#totalCount");
const doneCount = document.querySelector("#doneCount");
const pendingCount = document.querySelector("#pendingCount");

// Crea la estructura HTML de una tarea nueva (<li>)
function crearTarea(texto) {
  const li = document.createElement("li");
  li.classList.add("task");

  // Texto de la tarea
  const span = document.createElement("span");
  span.classList.add("task__text");
  span.textContent = texto;

  // Botón para eliminar la tarea
  const btnDelete = document.createElement("button");
  btnDelete.classList.add("delete-btn");
  btnDelete.type = "button";
  btnDelete.textContent = "Eliminar";

  // Inserta texto y botón dentro del <li>
  li.append(span, btnDelete);
  return li;
}

// Lee el input y agrega una tarea a la lista
function agregarTareaDesdeInput() {
  // trim() evita tareas vacías o solo con espacios
  const texto = taskInput.value.trim();
  if (!texto) return;

  const li = crearTarea(texto);
  taskList.append(li);
  actualizarContadores();

  // Limpia el input y lo vuelve a enfocar para escribir otra tarea
  taskInput.value = "";
  taskInput.focus();
}

// Click en "Agregar"
addTaskBtn.addEventListener("click", agregarTareaDesdeInput);

// Enter dentro del input también agrega la tarea
taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    agregarTareaDesdeInput();
  }
});

// Event Delegation
taskList.addEventListener("click", e => {
  const li = e.target.closest("li");
  if (!li) return;

  if (e.target.classList.contains("delete-btn")) {
    li.remove();
    actualizarContadores();
    return;
  }

  if (e.target.classList.contains("task__text")) {
    li.classList.toggle("completed");
    actualizarContadores();
  }
});

function actualizarContadores () {
  const total = taskList.children.length;
  const completadas = taskList.querySelectorAll("li.completed").length;
  const pendientes = total - completadas;

  totalCount.textContent = total;
  doneCount.textContent = completadas;
  pendingCount.textContent = pendientes;
}

actualizarContadores();
