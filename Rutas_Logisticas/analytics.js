// Calcular total de rutas procesadas, costo promedio, ruta mas economica, ruta mas costosa.

import { procesarRutas } from "./optimizer.js";

const rutas = [
  { id: "Sabaneta01", activa: true, factorCarga: 2.5 },
  { id: "Itagui01", activa: false, factorCarga: 3.0 },
  { id: "Envigado02", activa: true, factorCarga: 2.0 },
];

const resultados = await procesarRutas(...rutas);

const totalProcesadas = resultados.length;
console.log("Total de rutas procesadas:", totalProcesadas);

const totalCostos = resultados.reduce((acc, r) => acc + r.total, 0);
const costoPromedio = resultados.length ? totalCostos / resultados.length : 0;
console.log("Costo promedio:", costoPromedio);

const rutaMasEconomica = resultados.length
  ? resultados.reduce((min, r) => (r.total < min.total ? r : min), resultados[0])
  : null;
console.log("Ruta mas economica:", rutaMasEconomica);

const rutaMasCostosa = resultados.length
  ? resultados.reduce((max, r) => (r.total > max.total ? r : max), resultados[0])
  : null;
console.log("Ruta mas costosa:", rutaMasCostosa);

export const analiticas = {
  totalProcesadas,
  costoPromedio,
  rutaMasEconomica,
  rutaMasCostosa,
};
