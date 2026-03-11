// 1) ENTRADAS
const numeros = [12, 45, 67, 23, 89, 34, 56, 78, 90, 11];

// 2) PROCESO
function analizarNumeros(listaNumeros) {
    const resultado = {
        cantidadPares: 0,
        cantidadImpares: 0,
        cantidadMayoresA50: 0,
        sumaTotal: 0,
        promedio: 0,
    };

    for (const numero of listaNumeros) {
        if (numero % 2 === 0) {
            resultado.cantidadPares += 1;
        } else {
            resultado.cantidadImpares += 1;
        }

        if (numero > 50) {
            resultado.cantidadMayoresA50 += 1;
        }

        resultado.sumaTotal += numero;
    }

    resultado.promedio = resultado.sumaTotal / listaNumeros.length;
    return resultado;
}

// 3) SALIDA
const analisis = analizarNumeros(numeros);

console.log("Numeros del arreglo:", numeros);
console.log("Cantidad de pares:", analisis.cantidadPares);
console.log("Cantidad de impares:", analisis.cantidadImpares);
console.log("Cantidad de mayores a 50:", analisis.cantidadMayoresA50);
console.log("Suma total:", analisis.sumaTotal);
console.log("Promedio:", analisis.promedio);
