//Importar de util y grade

import { capitalizarNombre } from "./utils.js";
import { calcularPromedio, resultadoNota } from "./grades.js";

const crearStudent = (nombre, notas) => {
  const nombreFormateado = capitalizarNombre(nombre);
  const promedio = calcularPromedio(notas);

  const estado = resultadoNota(promedio);

  return { nombre: nombreFormateado, promedio, aprueba: estado };
};

export default crearStudent;
