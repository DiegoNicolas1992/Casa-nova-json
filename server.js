// Importamos módulos ESM
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ✅ Directorio correcto de la carpeta data
const dataDir = path.join(__dirname, 'data');

// Verifica que la carpeta data exista
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
  console.log('📁 Carpeta "data" creada automáticamente');
}

const app = express();
app.use(express.json());

// ----------------------
// FUNCIONES AUXILIARES
// ----------------------
const readJSON = (filename) => {
  const filePath = path.join(dataDir, filename);
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
};

const writeJSON = (filename, data) => {
  const filePath = path.join(dataDir, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// ----------------------
// RUTAS
// ----------------------

// 1️⃣ GET - Obtener todos los usuarios
app.get('/usuarios', (req, res) => {
  try {
    const data = readJSON('usuarios.json');
    console.log('Usuarios cargados:', data);
    res.json(data);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al leer usuarios', error: error.message });
  }
});

// 2️⃣ GET - Obtener todos los productos
app.get('/productos', (req, res) => {
  try {
    const data = readJSON('productos.json');
    console.log('Productos cargados:', data);
    res.json(data);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al leer productos', error: error.message });
  }
});

// 3️⃣ POST - Crear nuevo usuario
app.post('/usuarios', (req, res) => {
  try {
    const usuarios = readJSON('usuarios.json');
    const nuevoUsuario = { id: usuarios.length + 1, ...req.body };
    usuarios.push(nuevoUsuario);
    writeJSON('usuarios.json', usuarios);
    res.json({ mensaje: 'Usuario agregado correctamente', nuevoUsuario });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al agregar usuario', error: error.message });
  }
});

// 4️⃣ POST - Crear nueva venta
app.post('/ventas', (req, res) => {
  try {
    const ventas = readJSON('ventas.json');
    const nuevaVenta = { id: ventas.length + 1, ...req.body };
    ventas.push(nuevaVenta);
    writeJSON('ventas.json', ventas);
    res.json({ mensaje: 'Venta agregada correctamente', nuevaVenta });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al agregar venta', error: error.message });
  }
});

// 5️⃣ PUT - Actualizar producto existente
app.put('/productos/:id', (req, res) => {
  try {
    const productos = readJSON('productos.json');
    const id = parseInt(req.params.id);
    const index = productos.findIndex(p => p.id === id);
    if (index === -1) return res.status(404).json({ mensaje: 'Producto no encontrado' });
    productos[index] = { ...productos[index], ...req.body };
    writeJSON('productos.json', productos);
    res.json({ mensaje: 'Producto actualizado', producto: productos[index] });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar producto', error: error.message });
  }
});

// 6️⃣ DELETE - Eliminar usuario (verifica ventas asociadas)
app.delete('/usuarios/:id', (req, res) => {
  try {
    const idUsuario = parseInt(req.params.id);
    const usuarios = readJSON('usuarios.json');
    const ventas = readJSON('ventas.json');

    const tieneVentas = ventas.some(v => v.id_usuario === idUsuario);
    if (tieneVentas) {
      return res.status(400).json({ mensaje: 'No se puede eliminar el usuario, tiene ventas asociadas' });
    }

    const nuevosUsuarios = usuarios.filter(u => u.id !== idUsuario);
    writeJSON('usuarios.json', nuevosUsuarios);
    res.json({ mensaje: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar usuario', error: error.message });
  }
});

// Servidor
app.listen(3000, () => {
  console.log('✅ Servidor corriendo en http://localhost:3000');
});

export default app;
