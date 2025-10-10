# 📦 Casa Nova - Datos de ejemplo

Este repositorio contiene estructuras de datos en formato JSON y un servidor Express.js para un sistema de e-commerce ficticio llamado **Casa Nova**, especializado en artículos para el hogar y tecnología.

---

## 📂 Estructura de Datos (Primera Entrega)

- **usuarios.json** → Contiene los datos de clientes registrados.  
- **productos.json** → Lista de productos disponibles en la tienda.  
- **ventas.json** → Registra las ventas realizadas, vinculando usuarios y productos.  

### 🔗 Relaciones
- `ventas.json` referencia a `usuarios.json` mediante el campo `id_usuario`.  
- `ventas.json` referencia a `productos.json` mediante el campo `id` dentro de productos.

### ✅ Tipos de datos incluidos
- **Numéricos:** id, precio, total, cantidad.  
- **Cadenas:** nombre, apellido, email, desc, direccion.  
- **Booleanos:** activo, disponible.  

### 🚀 Próximos pasos
Estos datos fueron utilizados en esta segunda entrega para construir un **servidor Express.js** que permite:
- Gestión de usuarios.  
- Listado y actualización de productos.  
- Registro y consulta de ventas.  

---

## 📡 Rutas de la API (Segunda Entrega)

El servidor fue desarrollado con **Express.js** para gestionar las estructuras de datos del sistema *Casa Nova*.  
Cada ruta trabaja directamente con los archivos `.json` almacenados en la carpeta `data/`.

### 🔍 Rutas GET
| Método | Ruta | Descripción |
|--------|------|--------------|
| `GET` | `/usuarios` | Devuelve todos los usuarios del archivo `usuarios.json`. |
| `GET` | `/productos` | Devuelve todos los productos del archivo `productos.json`. |

### ✉️ Rutas POST
| Método | Ruta | Descripción |
|--------|------|--------------|
| `POST` | `/usuarios` | Crea un nuevo usuario y lo guarda en `usuarios.json`. |
| `POST` | `/ventas` | Registra una nueva venta en `ventas.json`. |

### 🛠️ Ruta PUT
| Método | Ruta | Descripción |
|--------|------|--------------|
| `PUT` | `/productos/:id` | Actualiza la información de un producto existente (por ID). |

### ❌ Ruta DELETE
| Método | Ruta | Descripción |
|--------|------|--------------|
| `DELETE` | `/usuarios/:id` | Elimina un usuario solo si no tiene ventas asociadas. |

---

## ⚙️ Configuración del Servidor

El servidor utiliza el puerto **3000** por defecto.

### 🔧 Instalación
Si ejecutás el proyecto localmente:
```bash
npm install express
node casa-nova-api/server.js
🧱 Estructura del proyecto
pgsql
Copiar código
casa-nova-json/
├── data/
│   ├── usuarios.json
│   ├── productos.json
│   └── ventas.json
├── casa-nova-api/
│   ├── server.js
│   └── .gitignore
└── README.md
✍️ Autor: Diego Nicolás Cuello
📅 Entrega: Segunda Etapa - Servidor con Express.js
📁 Repositorio: https://github.com/diegonicolas1992/casa-nova-json

yaml
Copiar código

