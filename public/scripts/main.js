const contenedorProductos = document.getElementById("productos");
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

async function cargarProductos() {
  const res = await fetch("http://localhost:3000/productos");
  const productos = await res.json();
  mostrarProductos(productos);
}

function mostrarProductos(productos) {
  contenedorProductos.innerHTML = "";

  productos.forEach(prod => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <img src="images/${prod.imagen || 'default.jpg'}" alt="${prod.nombre}">
      <h3>${prod.nombre}</h3>
      <p>${prod.desc}</p>
      <p><strong>$${prod.precio}</strong></p>
      <div class="cantidad">
        <button class="menos">-</button>
        <span>1</span>
        <button class="mas">+</button>
      </div>
      <button class="agregar">Agregar al carrito</button>
    `;

    let cantidad = 1;
    const span = card.querySelector("span");
    card.querySelector(".mas").addEventListener("click", () => {
      cantidad++;
      span.textContent = cantidad;
    });
    card.querySelector(".menos").addEventListener("click", () => {
      if (cantidad > 1) cantidad--;
      span.textContent = cantidad;
    });

    card.querySelector(".agregar").addEventListener("click", () => {
      agregarAlCarrito(prod, cantidad);
    });

    contenedorProductos.appendChild(card);
  });
}

function agregarAlCarrito(producto, cantidad) {
  const item = carrito.find(p => p.id === producto.id);
  if (item) {
    item.cantidad += cantidad;
  } else {
    carrito.push({ ...producto, cantidad });
  }
  localStorage.setItem("carrito", JSON.stringify(carrito));
  alert("Producto agregado al carrito 🛒");
}

cargarProductos();
