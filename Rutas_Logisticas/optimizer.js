// Funcion asincrona
// Recibe id de ruta y factor de carga (default). Usa distancia, costo, trafico y penalizacion de routes.
// Promise + setTimeout

import { mediciones } from "./routes.js";

const FACTOR_TRAFICO = {
  bajo: 1,
  medio: 1.1,
  alto: 1.25,
};

// Funcion que simula calculo pesado
export const procesarRuta = async (id = "Sabaneta01", factorCarga = 2.5) => {
  const ruta = mediciones.find((item) => item.id === id);
  if (!ruta) {
    throw new Error(`Ruta no encontrada: ${id}`);
  }

  const { distanciaKm, trafico, costoPorKm, penalizacion = false } = ruta;
  if (typeof distanciaKm !== "number" || typeof costoPorKm !== "number") {
    throw new Error(`Datos invalidos para la ruta: ${id}`);
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      const base = distanciaKm * factorCarga + 3 * costoPorKm;
      const factorTrafico = FACTOR_TRAFICO[trafico] ?? 1;
      const factorPenalizacion = penalizacion ? 1.05 : 1;
      const total = base * factorTrafico * factorPenalizacion;

      console.table({
        id,
        distanciaKm,
        costoPorKm,
        factorCarga,
        trafico,
        factorTrafico,
        penalizacion,
        factorPenalizacion,
        base,
        total,
      });

      resolve({
        id,
        distanciaKm,
        costoPorKm,
        factorCarga,
        trafico,
        penalizacion,
        base,
        factorTrafico,
        factorPenalizacion,
        total,
      });
    }, 2000); // Simula 2 segundos
  });
};

export const procesarRutas = async (...rutas) => {
  let resultados = [];

  for (const ruta of rutas) {
    if (!ruta?.activa) continue;

    try {
      const res = await procesarRuta(ruta.id, ruta.factorCarga);
      resultados = [...resultados, { ...ruta, ...res }];
    } catch (e) {
      console.error(`Error en ruta ${ruta?.id ?? "(sin id)"}:`, e.message);
    }
  }

  return resultados;
};
