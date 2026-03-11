// 1) ENTRADAS
const usuario = {
    nombre: "Luis",
    edad: 25,
    membresia: "Premium",
};

// 2) PROCESO
function obtenerMensajeAcceso(usuarioActual) {
    if (usuarioActual.edad < 18) {
        return `Lo siento, ${usuarioActual.nombre}, no puedes acceder al sistema porque eres menor de edad.`;
    }

    switch (usuarioActual.membresia) {
        case "Basic":
            return `Hola, ${usuarioActual.nombre}. Tienes acceso limitado.`;
        case "Premium":
            return `Hola, ${usuarioActual.nombre}. Tienes acceso completo.`;
        case "VIP":
            return `Hola, ${usuarioActual.nombre}. Tienes acceso completo y soporte prioritario.`;
        default:
            return `Hola, ${usuarioActual.nombre}. Tipo de membresia no reconocido.`;
    }
}

// 3) SALIDA
const mensajeFinal = obtenerMensajeAcceso(usuario);
console.log(mensajeFinal);
