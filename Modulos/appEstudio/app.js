import crearStudent from "./students.js";
import { calcularPromedio, resultadoNota } from "./grades.js";
import { capitalizarNombre, textoAMayuscula } from "./utils.js";

const estudiantes = [
  { nombre: "  luis fernando ", notas: [4.2, 3.8, 4.5] },
  { nombre: "maria jose", notas: [2.5, 3.1, 2.9] },
  { nombre: "CARLOS andres", notas: [3.0, 3.2, 3.4] },
];

const reporte = estudiantes.map((estudiante) =>
  crearStudent(estudiante.nombre, estudiante.notas),
);

console.log("=== REPORTE ESTUDIANTES ===");
console.table(reporte);

