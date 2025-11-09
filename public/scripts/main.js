document.addEventListener('DOMContentLoaded', () => {
  const contenedor = document.getElementById('productos-container');

  // Forzar que no se use caché
  const url = `/productos?t=${new Date().getTime()}`;

  fetch(url)
    .then(res => res.json())
    .then(productos => {
      contenedor.innerHTML = '';

      productos.forEach(p => {
        const card = document.createElement('div');
        card.classList.add('producto-card');
        card.innerHTML = `
          <img src="${p.imagen}" alt="${p.nombre}">
          <h3>${p.nombre}</h3>
          <p>$${p.precio.toLocaleString()}</p>
          <button class="agregar-btn" data-id="${p.id}">Agregar al carrito</button>
        `;
        contenedor.appendChild(card);
      });

      const botones = document.querySelectorAll('.agregar-btn');
      botones.forEach(btn => {
        btn.addEventListener('click', e => {
          const id = e.target.dataset.id;
          agregarAlCarrito(id);
        });
      });
    })
    .catch(err => console.error('Error al cargar productos:', err));
});

function agregarAlCarrito(id) {
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  fetch(`/productos?t=${new Date().getTime()}`)
    .then(res => res.json())
    .then(productos => {
      const producto = productos.find(p => p.id == id);
      if (!producto) return alert('Producto no encontrado');

      const existente = carrito.find(p => p.id == id);
      if (existente) existente.cantidad++;
      else carrito.push({ ...producto, cantidad: 1 });

      localStorage.setItem('carrito', JSON.stringify(carrito));
      alert(`${producto.nombre} agregado al carrito ✅`);
    });
}
