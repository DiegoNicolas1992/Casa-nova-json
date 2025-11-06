const contenedor = document.getElementById("productos");

fetch("/productos")
  .then(res => res.json())
  .then(data => {
    data.forEach(prod => {
      const card = document.createElement("div");
      card.classList.add("card");
      card.innerHTML = `
        <img src="${prod.imagen}" alt="${prod.nombre}">
        <h3>${prod.nombre}</h3>
        <p>💲${prod.precio}</p>
        <p>Categoría: ${prod.categoria}</p>
        <button onclick="agregarAlCarrito(${prod.id})">Agregar al carrito</button>
      `;
      contenedor.appendChild(card);
    });
  });

function agregarAlCarrito(id) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const producto = carrito.find(p => p.id === id);
  if (producto) {
    producto.cantidad++;
  } else {
    carrito.push({ id, cantidad: 1 });
  }
  localStorage.setItem("carrito", JSON.stringify(carrito));
  alert("Producto agregado al carrito 🛒");
}
