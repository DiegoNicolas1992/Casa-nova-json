# 🏠 Casa Nova JSON - 3° Entrega

Proyecto full stack con Node.js y frontend HTML/CSS/JS, que simula una tienda online conectada a un backend con Express.

## 🚀 Funcionalidades

- Listado de productos a la venta.
- Filtro por categoría o tipo de producto.
- Carrito de compras con almacenamiento en `localStorage`.
- Generación de orden de compra en el backend (`ventas.json`).
- Conexión entre frontend y servidor mediante modelo monorepo.

## ⚙️ Instrucciones para ejecutar

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/diegonicolas1992/casa-nova-json
Entrar a la carpeta del proyecto:

bash
Copiar código
cd casa-nova-json
Instalar dependencias:

bash
Copiar código
npm install
Ejecutar el servidor:

bash
Copiar código
node server.js
Abrir en el navegador:
http://localhost:3000

📂 Estructura del proyecto
pgsql
Copiar código
casa-nova-json/
│
├── data/
│   ├── productos.json
│   ├── usuarios.json
│   └── ventas.json
│
├── public/
│   ├── index.html
│   ├── carrito.html
│   ├── scripts/
│   │   ├── main.js
│   │   └── carrito.js
│   └── styles/
│       └── styles.css
│
├── server.js
├── package.json
└── README.md

