document.addEventListener("DOMContentLoaded", () => {
  const productosContainer = document.getElementById("productos");

  const productos = [
    {
      id: 1,
      nombre: "Camisa Blanca",
      precio: 15000,
      imagen: "images/camisa.jpg"
    },
    {
      id: 2,
      nombre: "Pantalón Jeans",
      precio: 22000,
      imagen: "images/jeans.jpg"
    },
    {
      id: 3,
      nombre: "Zapatillas Urbanas",
      precio: 35000,
      imagen: "images/zapatillas.jpg"
    },
    {
      id: 4,
      nombre: "Abrigo de Invierno",
      precio: 42000,
      imagen: "images/abrigo.jpg"
    }
  ];

  function mostrarProductos() {
    productos.forEach(p => {
      const card = document.createElement("div");
      card.classList.add("producto-card");
      card.innerHTML = `
        <img src="${p.imagen}" alt="${p.nombre}">
        <h3>${p.nombre}</h3>
        <p>$${p.precio.toLocaleString()}</p>
        <button class="btn-agregar" data-id="${p.id}">Agregar al carrito</button>
      `;
      productosContainer.appendChild(card);
    });
  }

  function agregarAlCarrito(id) {
    const producto = productos.find(p => p.id === id);
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const existe = carrito.find(p => p.id === id);

    if (existe) {
      existe.cantidad++;
    } else {
      carrito.push({ ...producto, cantidad: 1 });
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    alert(`✅ ${producto.nombre} agregado al carrito`);
  }

  productosContainer.addEventListener("click", e => {
    if (e.target.classList.contains("btn-agregar")) {
      const id = parseInt(e.target.dataset.id);
      agregarAlCarrito(id);
    }
  });

  mostrarProductos();
});
