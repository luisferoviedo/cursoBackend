import { procesarRutas } from "./optimizer.js";

const main = async () => {
  console.log(`Inicio del proceso: ${new Date().toLocaleString()}`);

  const rutas = [
    { id: "Sabaneta01", activa:true, factorCarga: 2.5},
    { id: "Itagui01", activa:false, factorCarga: 3.0},
    { id: "Envigado02", activa:true, factorCarga: 2.0},
  ];

  const resultados = await procesarRutas(...rutas);

  console.log(`Total procesadas: ${resultados.length}`);
  console.log(`Primera ruta: ${resultados[0]?.id ?? "sin datos"}`);
  console.log(`Costo de primera ruta: ${resultados[0]?.total ?? 0}`);

  console.log(`Fin del proceso: ${new Date().toLocaleString()}`);
};

main().catch((err) => {
  console.error(`Error en el proceso: ${err.message}`);
  process.exitCode = 1;
});
