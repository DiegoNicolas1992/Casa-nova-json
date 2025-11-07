document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.getElementById("productos");
  const usuarioSpan = document.getElementById("usuario-nombre");

  // 👋 Mostrar nombre del usuario si está logueado
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  if (usuario && usuario.nombre) {
    usuarioSpan.textContent = `Hola, ${usuario.nombre} 👋`;
  } else {
    usuarioSpan.textContent = "Invitado";
  }

  // 🔐 Botón cerrar sesión
  document.getElementById("btn-logout")?.addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    alert("Sesión cerrada correctamente 👋");
    window.location.href = "login.html";
  });

  // 🛒 Cargar productos desde el servidor
  fetch("http://localhost:3000/productos")
    .then(res => res.json())
    .then(productos => {
      productos.forEach(p => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
          <img src="${p.imagen}" alt="${p.nombre}">
          <h3>${p.nombre}</h3>
          <p>$${p.precio.toLocaleString()}</p>
          <button class="btn-agregar">Agregar al carrito 🛒</button>
        `;
        card.querySelector(".btn-agregar").addEventListener("click", () => agregarAlCarrito(p));
        contenedor.appendChild(card);
      });
    });

  // 🧩 Agregar producto al carrito
  function agregarAlCarrito(producto) {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const existe = carrito.find(p => p.id === producto.id);
    if (existe) {
      existe.cantidad++;
    } else {
      carrito.push({ ...producto, cantidad: 1 });
    }
    localStorage.setItem("carrito", JSON.stringify(carrito));
    alert(`${producto.nombre} agregado al carrito 🛒`);
  }
});
