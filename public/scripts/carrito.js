document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.getElementById("carrito");
  const totalSpan = document.getElementById("total");
  const btnLimpiar = document.getElementById("btn-limpiar");
  const btnComprar = document.getElementById("btn-comprar");

  function mostrarCarrito() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    contenedor.innerHTML = "";

    if (carrito.length === 0) {
      contenedor.innerHTML = "<p>Tu carrito está vacío 🛒</p>";
      totalSpan.textContent = "$0";
      return;
    }

    carrito.forEach((p, i) => {
      const item = document.createElement("div");
      item.classList.add("item-carrito");
      item.innerHTML = `
        <img src="${p.imagen}" alt="${p.nombre}" class="carrito-img">
        <div class="info">
          <h4>${p.nombre}</h4>
          <p>$${p.precio.toLocaleString()}</p>
          <div class="controles">
            <button class="btn-restar" data-index="${i}">−</button>
            <span>${p.cantidad}</span>
            <button class="btn-sumar" data-index="${i}">+</button>
          </div>
        </div>
      `;
      contenedor.appendChild(item);
    });

    const total = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
    totalSpan.textContent = `$${total.toLocaleString()}`;
  }

  // ➕ ➖ Cambiar cantidad dentro del carrito
  contenedor.addEventListener("click", e => {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    if (e.target.classList.contains("btn-sumar")) {
      const i = e.target.dataset.index;
      carrito[i].cantidad++;
    } else if (e.target.classList.contains("btn-restar")) {
      const i = e.target.dataset.index;
      if (carrito[i].cantidad > 1) carrito[i].cantidad--;
      else carrito.splice(i, 1);
    }
    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarCarrito();
  });

  // 🧹 Limpiar carrito
  btnLimpiar.addEventListener("click", () => {
    localStorage.removeItem("carrito");
    mostrarCarrito();
  });

  // 💳 Enviar compra al backend con token JWT
  btnComprar.addEventListener("click", async () => {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    if (carrito.length === 0) {
      alert("Tu carrito está vacío 🛒");
      return;
    }

    // 🪪 Token almacenado (por ejemplo después del login)
    const token = localStorage.getItem("token");
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    if (!token || !usuario) {
      alert("Por favor, iniciá sesión antes de comprar 🔐");
      return;
    }

    const compra = {
      id_usuario: usuario.id,
      productos: carrito
    };

    try {
      const res = await fetch("http://localhost:3000/comprar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        },
        body: JSON.stringify(compra)
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ " + data.mensaje);
        localStorage.removeItem("carrito");
        mostrarCarrito();
      } else {
        alert("⚠️ Error: " + (data.error || "No se pudo completar la compra"));
      }
    } catch (error) {
      alert("❌ Error de conexión con el servidor");
      console.error(error);
    }
  });

  mostrarCarrito();
});
