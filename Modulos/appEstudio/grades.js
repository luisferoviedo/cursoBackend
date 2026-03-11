//Funcion Calcular promedio de un arreglo
const calcularPromedio = (numeros) => {
  if (!Array.isArray(numeros) || numeros.length == 0) return 0;

  const suma = numeros.reduce((acc,n) => acc + n,0)
  return suma / numeros.length;
};

//Aprueba > 3.0
const aprueba = (nota) => Number.isFinite(nota) && nota >=3;
const resultadoNota = (nota) => (!aprueba(nota) && "Reprobado" || "Aprobado");


// Uso de Named Exports

export { resultadoNota, aprueba,calcularPromedio}
