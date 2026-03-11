// Crear un Dashboard a partir de datos de API.

// En este ejemplo usamos callback para devolver los datos o el error.
// Firma del callback: callback(error, data)

// Función que simula latencia y luego consulta datos personales de un usuario.
function obtenerDatosPersonales(url, callback) {
  console.log('Obteniendo datos personales...');

  setTimeout(() => {
    // Petición HTTP a la API.
    fetch('https://dummyjson.com/users/1')
      // Convertimos la respuesta a JSON.
      .then(res => res.json())
      // Éxito: error = null, data = usuario.
      .then(data => callback(null, data))
      // Falla: error = objeto Error, data = null.
      .catch(error => callback(error, null));

  }, 2000);

}

// Consumimos la función con callback para mostrar el dashboard por consola.
obtenerDatosPersonales("https://dummyjson.com/users/1", (err, user) => {
  // Si hay error, detenemos el flujo.
  if (err) return;

  // Render simple del dashboard.
  console.log("\n===== DASHBOARD =====");
  console.log("Nombre:", user.firstName, user.lastName);
  console.log("Edad:", user.age);
  console.log("Email:", user.email);
  console.log("Ciudad:", user.address?.city);
  console.log("=====================\n");
});



