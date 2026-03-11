//Convertir texto a Mayuscula

const textoAMayuscula = (texto) => texto.toUpperCase();

//Capitalizar nombre

const capitalizarNombre = (nombre) =>
  nombre
  .toLowerCase()
  .trim()
  .split(" ")
  .filter((p) => p !== "")
  .map((p) => p[0].toUpperCase() + p.slice(1))
  .join(" ");

// Uso de Named Exports

export { textoAMayuscula, capitalizarNombre};
