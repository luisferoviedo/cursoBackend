// Consulta una API externa para validar disponibilidad del servicio.
async function consultarApi() {
  console.log("Consultando API externa...");
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/todos/1");
    // Si la API responde, pero con error HTTP, detenemos el flujo.
    if (!response.ok) {
      throw new Error("Error HTTP al consultar API: " + response.status);
    }
    const data = await response.json();
    console.log("Respuesta API:", data);
    return data;
  } catch (error) {
    // Respaldo local para poder seguir probando sin conexión.
    console.warn("No se pudo consultar la API. Usando respaldo local:", error.message);
    return {
      id: 1,
      title: "respaldo-local",
      completed: true
    };
  }
}

// Orquesta todo el flujo del pedido de forma secuencial con async/await.
async function procesarPedido(pedido) {
    try {
      const data = await consultarApi();
      // Validación mínima de la estructura esperada de la API.
      if (typeof data.completed !== "boolean") {
        throw new Error("API: respuesta inválida");
      }
        const validacion = await validarPedido(pedido);
        console.log(validacion);

        const pago = await procesarPago(pedido);
        console.log(pago);

        const envio = await prepararEnvio(pedido);
        console.log(envio);

        console.log("Pedido procesado exitosamente: " + JSON.stringify(pedido));
    } catch (error) {
        console.error("Error al procesar el pedido: " + error.message);
    }
}

// Verifica que el pedido tenga al menos un producto.
function validarPedido(pedido) {
    return new Promise((resolve, reject) => {
      console.log("Validando pedido... " + JSON.stringify(pedido));

        setTimeout(() => {
            if (!pedido.productos || pedido.productos.length === 0) {
                reject(new Error("Pedido inválido: " + JSON.stringify(pedido)));
            } else {
                resolve("Pedido válido: " + JSON.stringify(pedido));
            }
        }, 1000);
    });
  }

// Simula el pago y marca el pedido como aprobado si el método es válido.
function procesarPago(pedido) {
    return new Promise((resolve, reject) => {
        console.log("Procesando pago... " + pedido.metodoPago);

        setTimeout(() => {
            const metodosValidos = ["tarjeta", "nequi", "efectivo"];
            if (metodosValidos.includes(pedido.metodoPago)) {
              pedido.pagoAprobado = true;
              resolve("Pago procesado: " + JSON.stringify(pedido));
            } else {
                reject(new Error("Método de pago no válido: " + pedido.metodoPago + " para el pedido: " + JSON.stringify(pedido)));
            }
        }, 2000);
      });
  }

// Simula la preparación del envío validando pago y dirección.
function prepararEnvio(pedido) {
    return new Promise((resolve, reject) => {
        console.log("Preparando envío... " + pedido.direccion);

        setTimeout(() => {
            if (!pedido.pagoAprobado) {
                reject(new Error("Pago no aprobado para el pedido: " + JSON.stringify(pedido)));
            } else
            if (!pedido.direccion) {
                reject(new Error("Dirección no válida: " + pedido.direccion));
            } else {
                resolve("Envío preparado: " + JSON.stringify(pedido));
            }
        }, 1500);
      });
  }




// Pedido de prueba para ejecutar el flujo completo.
const pedido = {
  productos: ["Hamburguesa", "Papas"],
  metodoPago: "tarjeta",
  direccion: "Calle 10 #20-30"
};

procesarPedido(pedido);
