const contenedor = document.getElementById("productos");
const filtro = document.getElementById("filtroCategoria");
let productos = [];
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

fetch("/productos")
  .then(res => res.json())
  .then(data => {
    productos = data;
    mostrarProductos(productos);
    cargarCategorias();
  });

function mostrarProductos(lista) {
  contenedor.innerHTML = "";
  lista.forEach(p => {
    const card = document.createElement("div");
    card.className = "bg-white p-4 rounded shadow";
    card.innerHTML = `
      <h3 class="text-lg font-semibold">${p.nombre}</h3>
      <p class="text-gray-600">${p.categoria}</p>
      <p class="font-bold mt-2">$${p.precio}</p>
      <button class="bg-blue-600 text-white mt-3 px-3 py-1 rounded hover:bg-blue-700" onclick="agregarAlCarrito(${p.id})">Agregar al carrito</button>
    `;
    contenedor.appendChild(card);
  });
}

function cargarCategorias() {
  const categorias = ["todos", ...new Set(productos.map(p => p.categoria))];
  categorias.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    filtro.appendChild(option);
  });
}

filtro.addEventListener("change", () => {
  const seleccion = filtro.value;
  if (seleccion === "todos") mostrarProductos(productos);
  else mostrarProductos(productos.filter(p => p.categoria === seleccion));
});

function agregarAlCarrito(id) {
  const producto = productos.find(p => p.id === id);
  const item = carrito.find(p => p.id === id);
  if (item) item.cantidad++;
  else carrito.push({ ...producto, cantidad: 1 });
  localStorage.setItem("carrito", JSON.stringify(carrito));
  alert(`${producto.nombre} agregado al carrito`);
}
