registrarUsuario("usuario1", "contraseña1");
registrarUsuario("usuario2", "contraseña2");

iniciarSesion("usuario1", "contraseña1");
iniciarSesion("usuario2", "contraseña2");

cerrarSesion("usuario1");
cerrarSesion("usuario2");

mostrarPerfil("usuario1");
mostrarPerfil("usuario2");

actualizarPerfil("usuario1", { nombre: "Usuario Uno", edad: 30 });
actualizarPerfil("usuario2", { nombre: "Usuario Dos", edad: 25 });

mostrarPerfil("usuario1");
mostrarPerfil("usuario2");  
