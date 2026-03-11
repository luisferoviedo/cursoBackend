// Crear calculador de descuento
function crearCalculadorDescuento(porcentaje) {
    return function (precio) {
        return precio - (precio * porcentaje) / 100;
    };
}

// Crear funciones con descuentos específicos
const aplicar10 = crearCalculadorDescuento(10);
const aplicar20 = crearCalculadorDescuento(20);
const aplicar50 = crearCalculadorDescuento(50);

// Mostrar el precio final con la función de descuento recibida
function mostrarPrecioConDescuento(producto, precio, aplicarDescuento) {
    const precioFinal = aplicarDescuento(precio);
    console.log(`${producto}: $${precioFinal.toFixed(2)}`);
}

// Ejemplo de uso
mostrarPrecioConDescuento("Camiseta", 100, aplicar10);
mostrarPrecioConDescuento("Pantalon", 200, aplicar20);
mostrarPrecioConDescuento("Zapatos", 150, aplicar50);
