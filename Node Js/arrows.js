// 1) ENTRADAS
const numeroA = 5;
const numeroB = 3;

// 2) PROCESO
const sumar = (a, b) => a + b;
const restar = (a, b) => a - b;
const multiplicar = (a, b) => a * b;

function mostrarResultado(nombreOperacion, resultado) {
    console.log(`${nombreOperacion}: ${resultado}`);
}

const crearCalculadorDescuento = (porcentaje) => {
    return (precio) => precio - (precio * porcentaje / 100);
};

function mostrarPrecioConDescuento(nombreProducto, precioOriginal, funcionDescuento) {
    const precioFinal = funcionDescuento(precioOriginal);
    console.log(`${nombreProducto}: $${precioFinal.toFixed(2)}`);
}

// 3) SALIDA
mostrarResultado("Suma", sumar(numeroA, numeroB));
mostrarResultado("Resta", restar(10, 4));
mostrarResultado("Multiplicacion", multiplicar(6, 7));

const aplicar10 = crearCalculadorDescuento(10);
const aplicar20 = crearCalculadorDescuento(20);
const aplicar50 = crearCalculadorDescuento(50);

mostrarPrecioConDescuento("Camiseta", 100, aplicar10);
mostrarPrecioConDescuento("Pantalon", 200, aplicar20);
mostrarPrecioConDescuento("Zapatos", 150, aplicar50);
