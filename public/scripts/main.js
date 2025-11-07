document.addEventListener("DOMContentLoaded", async () => {
  const contenedor = document.getElementById("productos");
  const res = await fetch("/productos");
  const productos = await res.json();

  productos.forEach(p => {
    const card = document.createElement("div");
    card.classList.add("producto-card");

    card.innerHTML = `
      <img src="${p.imagen}" alt="${p.nombre}" class="producto-img">
      <h3>${p.nombre}</h3>
      <p>Categoría: ${p.categoria}</p>
      <p>Precio: $${p.precio.toLocaleString()}</p>
      <div class="cantidad-control">
        <button class="btn-restar" data-id="${p.id}">−</button>
        <span id="cantidad-${p.id}" class="cantidad">1</span>
        <button class="btn-sumar" data-id="${p.id}">+</button>
      </div>
      <button class="btn-agregar" data-id="${p.id}">Agregar al carrito</button>
    `;

    contenedor.appendChild(card);
  });

  // 🔹 Control de cantidad en las cards
  document.querySelectorAll(".btn-sumar").forEach(btn => {
    btn.addEventListener("click", e => {
      const id = e.target.dataset.id;
      const span = document.getElementById(`cantidad-${id}`);
      let cant = parseInt(span.textContent);
      span.textContent = cant + 1;
    });
  });

  document.querySelectorAll(".btn-restar").forEach(btn => {
    btn.addEventListener("click", e => {
      const id = e.target.dataset.id;
      const span = document.getElementById(`cantidad-${id}`);
      let cant = parseInt(span.textContent);
      if (cant > 1) span.textContent = cant - 1;
    });
  });

  // 🛒 Agregar productos al carrito
  document.querySelectorAll(".btn-agregar").forEach(btn => {
    btn.addEventListener("click", e => {
      const id = parseInt(e.target.dataset.id);
      const producto = productos.find(p => p.id === id);
      const cantidad = parseInt(document.getElementById(`cantidad-${id}`).textContent);

      let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
      const existente = carrito.find(item => item.id === id);

      if (existente) {
        existente.cantidad += cantidad;
      } else {
        carrito.push({ ...producto, cantidad });
      }

      localStorage.setItem("carrito", JSON.stringify(carrito));
      alert(`${producto.nombre} agregado al carrito ✅`);
    });
  });
});
