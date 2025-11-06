const carritoContainer = document.getElementById("carrito");
const totalTexto = document.getElementById("total");
const btnVaciar = document.getElementById("vaciar");

function renderCarrito() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  carritoContainer.innerHTML = "";

  fetch("/productos")
    .then(res => res.json())
    .then(productos => {
      let total = 0;
      carrito.forEach(item => {
        const producto = productos.find(p => p.id === item.id);
        if (producto) {
          total += producto.precio * item.cantidad;
          const card = document.createElement("div");
          card.classList.add("card");
          card.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <h3>${producto.nombre}</h3>
            <p>💲${producto.precio}</p>
            <div>
              <button onclick="cambiarCantidad(${producto.id}, -1)">-</button>
              <span>${item.cantidad}</span>
              <button onclick="cambiarCantidad(${producto.id}, 1)">+</button>
            </div>
          `;
          carritoContainer.appendChild(card);
        }
      });
      totalTexto.textContent = `💰 Total: $${total}`;
    });
}

function cambiarCantidad(id, cambio) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const producto = carrito.find(p => p.id === id);
  if (producto) {
    producto.cantidad += cambio;
    if (producto.cantidad <= 0) {
      carrito = carrito.filter(p => p.id !== id);
    }
    localStorage.setItem("carrito", JSON.stringify(carrito));
    renderCarrito();
  }
}

btnVaciar.addEventListener("click", () => {
  localStorage.removeItem("carrito");
  renderCarrito();
});

renderCarrito();
