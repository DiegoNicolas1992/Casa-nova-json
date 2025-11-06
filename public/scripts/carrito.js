let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
const contenedorCarrito = document.getElementById("carrito");
const btnLimpiar = document.getElementById("limpiarCarrito");

function mostrarCarrito() {
  contenedorCarrito.innerHTML = "";

  if (carrito.length === 0) {
    contenedorCarrito.innerHTML = "<p>Tu carrito está vacío 🛒</p>";
    return;
  }

  carrito.forEach((prod, index) => {
    const item = document.createElement("div");
    item.classList.add("item-carrito");
    item.innerHTML = `
      <img src="images/${prod.imagen || 'default.jpg'}" alt="${prod.nombre}">
      <h3>${prod.nombre}</h3>
      <p>$${prod.precio}</p>
      <div class="cantidad">
        <button class="menos">-</button>
        <span>${prod.cantidad}</span>
        <button class="mas">+</button>
      </div>
      <p>Total: $${(prod.precio * prod.cantidad).toFixed(2)}</p>
    `;

    const span = item.querySelector("span");
    item.querySelector(".mas").addEventListener("click", () => {
      prod.cantidad++;
      span.textContent = prod.cantidad;
      guardarCarrito();
      mostrarCarrito();
    });
    item.querySelector(".menos").addEventListener("click", () => {
      if (prod.cantidad > 1) {
        prod.cantidad--;
        span.textContent = prod.cantidad;
      } else {
        carrito.splice(index, 1);
      }
      guardarCarrito();
      mostrarCarrito();
    });

    contenedorCarrito.appendChild(item);
  });

  const total = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
  const totalDiv = document.createElement("div");
  totalDiv.classList.add("total");
  totalDiv.innerHTML = `<h2>Total: $${total.toFixed(2)}</h2>`;
  contenedorCarrito.appendChild(totalDiv);
}

function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

btnLimpiar.addEventListener("click", () => {
  localStorage.removeItem("carrito");
  carrito = [];
  mostrarCarrito();
});

mostrarCarrito();
