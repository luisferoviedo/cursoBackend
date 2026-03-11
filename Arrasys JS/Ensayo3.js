function crearPedido(cliente = "Cliente Invitado", ...productos) {
  const listaProductos = [...productos];
  const total = listaProductos.reduce((acc, p) => acc + Number(p.precio), 0);
const cantidad = listaProductos.length;

return resumen = {
  cliente,
  productos: listaProductos,
  total,
  cantidad
};
console.log(resumen);


const pedido = crearPedido(
  "Miguel",
  { nombre: "pan", precio: 5000 },
  { nombre: "leche", precio: 10000 }
);
console.log(pedido);
}
