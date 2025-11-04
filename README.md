# 🏠 Casa Nova - API con Express.js

Este proyecto corresponde a la **Segunda Entrega** del desarrollo del sistema **Casa Nova**, un e-commerce ficticio especializado en artículos para el hogar y tecnología.  
El objetivo fue implementar un **servidor con Express.js** que gestione estructuras de datos almacenadas en archivos `.json`.

---

## 📂 Estructura del Proyecto

casa-nova-json/
├── data/
│ ├── usuarios.json
│ ├── productos.json
│ └── ventas.json
├── .gitignore
├── package.json
├── server.js
└── README.md

yaml
Copiar código

---

## 🧱 Descripción de Archivos

- **usuarios.json:** Contiene los datos de los clientes registrados.  
- **productos.json:** Incluye el listado de productos disponibles.  
- **ventas.json:** Registra las ventas realizadas, vinculando usuarios y productos.

---

## 🔗 Relaciones Entre Archivos

- `ventas.json` referencia a `usuarios.json` mediante el campo **id_usuario**.  
- `ventas.json` referencia a `productos.json` mediante el campo **id** dentro de productos.

---

## ⚙️ Instalación y Ejecución del Servidor

1. Clonar o descargar el repositorio:
   ```bash
   git clone https://github.com/DiegoNicolas1992/Casa-nova-json
Acceder a la carpeta del proyecto:

bash
Copiar código
cd Casa-nova-json
Instalar dependencias:

bash
Copiar código
npm install express
Ejecutar el servidor:

bash
Copiar código
node server.js
Acceder desde el navegador o Postman:

arduino
Copiar código
http://localhost:3000
📡 Rutas de la API (Endpoints)
Método	Ruta	Descripción
GET	/usuarios	Devuelve todos los usuarios del archivo usuarios.json.
GET	/productos	Devuelve todos los productos del archivo productos.json.
POST	/usuarios	Crea un nuevo usuario y lo guarda en usuarios.json.
POST	/ventas	Registra una nueva venta en ventas.json.
PUT	/productos/:id	Actualiza la información de un producto existente (por ID).
DELETE	/usuarios/:id	Elimina un usuario solo si no tiene ventas asociadas, preservando la integridad de los datos.

🧩 Dependencias
Express.js — Framework para crear el servidor y manejar las rutas.

📘 Ejemplo de Ejecución Exitosa
bash
Copiar código
✅ Servidor corriendo en http://localhost:3000
GET /usuarios -> 3 registros
GET /productos -> 3 registros
✍️ Autor
Diego Nicolás Cuello
📅 Entrega: Segunda Etapa – Servidor con Express.js
📁 Repositorio: Casa Nova JSON


