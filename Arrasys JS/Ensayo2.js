const estudiantes = [
  { id: 1, nombre: "Laura", nota: 4.5, activo: true },
  { id: 2, nombre: "Carlos", nota: 2.8, activo: false },
  { id: 3, nombre: "Sofía", nota: 3.9, activo: true },
  { id: 4, nombre: "Mateo", nota: 4.8, activo: true },
  { id: 5, nombre: "Valentina", nota: 2.5, activo: false }
];

// 1. Obtener nombres de estudiantes activos
const activos = estudiantes
  .filter(i => i.activo)                           // Filtra solo los estudiantes activos
  .map(i => i.nombre);                            // Filtra el nombre de los estudiantes activos
    console.log("Estudiantes activos:", activos); // Muestra los nombres de los estudiantes activos

// 2. Calcular promedio de notas con reduce
const promedio = estudiantes.reduce((acc, i) => acc + i.nota, 0) / estudiantes.length;
console.log("Promedio de notas:", promedio.toFixed(2), "sobre 5.0"); // 3. Muestra el promedio de notas con 2 decimales

//4. Verificar si estudiantes activos aprobaron, aprueba >= 3.0 con every
const todosAprobaron = estudiantes
  .every(i => i.nota >= 3.0); // Verifica si todos los estudiantes aprobaron con nota >= 3.0
console.log("¿Todos los estudiantes aprobaron?", todosAprobaron ? "Si aprobaron" : "No aprobaron"); // Muestra si todos los estudiantes aprobaron
//5. Verificar si hay algún estudiante con nota superior a 4.5 con find
const estudianteConNotaAlta = estudiantes.find(i => i.nota > 4.5);
console.log("Estudiante con nota superior a 4.5:", estudianteConNotaAlta ? estudianteConNotaAlta.nombre : "Ninguno"); // Muestra el nombre del estudiante con nota superior a 4.5 o "Ninguno" si no hay

//6: Crear nueva lista con Aprobados y Reprobados con map
const estudiantesConEstado = estudiantes.map(i => {
  return {
    ...i, // 1. "Copiamos" todas las propiedades que ya tenía (nombre, nota, etc.)
    estado: i.nota >= 3.0 ? "Aprobado" : "Reprobado" // 2. "Añadimos" la nueva propiedad
  };
});
console.log("Listado Aprobado Reprobado", estudiantesConEstado); // Muestra la nueva lista de estudiantes con su estado de aprobado o reprobado
console.table(estudiantesConEstado, ["nombre", "estado"]); // Muestra en formato tabla solo el nombre y estado de cada estudiante
