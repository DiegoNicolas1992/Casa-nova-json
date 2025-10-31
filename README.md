# 🏠 Casa Nova - Datos y Servidor Express.js

Este repositorio contiene estructuras de datos en formato JSON y un servidor **Express.js** para un sistema de comercio electrónico ficticio llamado **Casa Nova**, especializado en artículos para el hogar y tecnología.

---

## 📂 Estructura de Datos (Primera Entrega)

- **usuarios.json** → Contiene los datos de clientes registrados.  
- **productos.json** → Lista de productos disponibles en la tienda.  
- **ventas.json** → Registra las ventas realizadas, vinculando usuarios y productos.

### 🔗 Relaciones
- `ventas.json` referencia a `usuarios.json` mediante el campo **id_usuario**.  
- `ventas.json` referencia a `productos.json` mediante el campo **id** dentro de productos.

### ✅ Tipos de datos incluidos
- **Numéricos:** id, precio, total, cantidad  
- **Cadenas:** nombre, apellido, email, desc, dirección  
- **Booleanos:** activo, disponible  

---

## 🚀 Segunda Etapa - Servidor Express.js

En esta etapa se desarrolló un servidor con **Express.js** que permite gestionar las estructuras de datos del sistema **Casa Nova**.

Cada ruta trabaja directamente con los archivos `.json` almacenados en la carpeta `data/`.

---

## 📡 Rutas de la API

### 🔍 Rutas GET
| Método | Ruta | Descripción |
|---------|------|-------------|
| GET | `/usuarios` | Devuelve todos los usuarios del archivo `usuarios.json`. |
| GET | `/productos` | Devuelve todos los productos del archivo `productos.json`. |

### ✉️ Rutas POST
| Método | Ruta | Descripción |
|---------|------|-------------|
| POST | `/usuarios` | Crea un nuevo usuario y lo guarda en `usuarios.json`. |
| POST | `/ventas` | Registra una nueva venta en `ventas.json`. |

### 🛠️ Ruta PUT
| Método | Ruta | Descripción |
|---------|------|-------------|
| PUT | `/productos/:id` | Actualiza la información de un producto existente (por ID). |

### ❌ Ruta DELETE
| Método | Ruta | Descripción |
|---------|------|-------------|
| DELETE | `/usuarios/:id` | Elimina un usuario si no tiene ventas asociadas. |

---

## ⚙️ Configuración del Servidor

El servidor utiliza el **puerto 3000** por defecto.  
Se puede ejecutar localmente con:

```bash
npm install express
node servidor.js
🧱 Estructura del Proyecto
pgsql
Copiar código
casa-nova-json/
├── data/
│   ├── usuarios.json
│   ├── productos.json
│   └── ventas.json
├── servidor.js
├── package.json
├── .gitignore
└── README.md
🚫 Archivo .gitignore
perl
Copiar código
# Dependencias de Node.js
node_modules/

# Bloquear dependencias generadas por npm
package-lock.json



