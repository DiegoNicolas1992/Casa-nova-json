const contenedor = document.getElementById("carrito");
const total = document.getElementById("total");
const btnComprar = document.getElementById("btnComprar");

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

function mostrarCarrito() {
  contenedor.innerHTML = "";
  let totalCompra = 0;

  carrito.forEach(item => {
    totalCompra += item.precio * item.cantidad;
    const div = document.createElement("div");
    div.className = "bg-white p-4 rounded shadow flex justify-between items-center";
    div.innerHTML = `
      <span>${item.nombre} (x${item.cantidad})</span>
      <span>$${item.precio * item.cantidad}</span>
    `;
    contenedor.appendChild(div);
  });

  total.textContent = carrito.length ? `Total: $${totalCompra}` : "Carrito vacío";
}

mostrarCarrito();

btnComprar.addEventListener("click", async () => {
  if (carrito.length === 0) return alert("Tu carrito está vacío");

  const venta = {
    fecha: new Date().toISOString(),
    total: carrito.reduce((t, p) => t + p.precio * p.cantidad, 0),
    productos: carrito,
  };

  const res = await fetch("/ventas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(venta),
  });

  if (res.ok) {
    alert("✅ Compra realizada con éxito");
    localStorage.removeItem("carrito");
    carrito = [];
    mostrarCarrito();
  } else {
    alert("❌ Error al realizar la compra");
  }
});
