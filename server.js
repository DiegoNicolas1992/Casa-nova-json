// server.js (ESM) - versión robusta para entrega
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, 'data');

// Asegura carpeta data
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
  console.log('📁 Carpeta "data" creada automáticamente');
}

const app = express();
app.use(express.json());

// Helpers
const readJSON = (file) => {
  const p = path.join(dataDir, file);
  if (!fs.existsSync(p)) return [];
  const raw = fs.readFileSync(p, 'utf8');
  try { return JSON.parse(raw); }
  catch (e) {
    console.error(`Error parseando ${file}:`, e.message);
    throw new Error(`JSON inválido en ${file}`);
  }
};

const writeJSON = (file, data) => {
  const p = path.join(dataDir, file);
  fs.writeFileSync(p, JSON.stringify(data, null, 2), 'utf8');
};

// Ruta raíz para verificar servidor
app.get('/', (req, res) => {
  res.json({ mensaje: 'API Casa Nova funcionando', rutas: ['/usuarios','/productos','/ventas'] });
});

// GET /usuarios
app.get('/usuarios', (req, res) => {
  try {
    const usuarios = readJSON('usuarios.json');
    console.log('GET /usuarios ->', usuarios.length, 'registros');
    return res.json(usuarios);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// GET /productos
app.get('/productos', (req, res) => {
  try {
    const productos = readJSON('productos.json');
    console.log('GET /productos ->', productos.length, 'registros');
    return res.json(productos);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// GET /ventas
app.get('/ventas', (req, res) => {
  try {
    const ventas = readJSON('ventas.json');
    console.log('GET /ventas ->', ventas.length, 'registros');
    return res.json(ventas);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// POST /usuarios
app.post('/usuarios', (req, res) => {
  try {
    const { nombre, apellido, email, contrasena } = req.body;
    if (!nombre || !email) return res.status(400).json({ error: 'nombre y email son requeridos' });

    const usuarios = readJSON('usuarios.json');
    const nuevo = {
      id: usuarios.length ? usuarios[usuarios.length - 1].id + 1 : 1,
      nombre, apellido: apellido || '', email, contrasena: contrasena || '', activo: true
    };
    usuarios.push(nuevo);
    writeJSON('usuarios.json', usuarios);
    console.log('POST /usuarios -> nuevo id', nuevo.id);
    return res.status(201).json(nuevo);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// POST /ventas
app.post('/ventas', (req, res) => {
  try {
    const { id_usuario, productos, direccion, total } = req.body;
    if (!id_usuario || !Array.isArray(productos) || productos.length === 0) {
      return res.status(400).json({ error: 'id_usuario y productos (array) son requeridos' });
    }

    const usuarios = readJSON('usuarios.json');
    if (!usuarios.some(u => u.id === id_usuario)) {
      return res.status(400).json({ error: 'id_usuario no existe' });
    }

    const ventas = readJSON('ventas.json');
    const nueva = {
      id: ventas.length ? ventas[ventas.length - 1].id + 1 : 1001,
      id_usuario,
      fecha: new Date().toISOString().split('T')[0],
      total: total || 0,
      direccion: direccion || '',
      productos
    };
    ventas.push(nueva);
    writeJSON('ventas.json', ventas);
    console.log('POST /ventas -> nueva id', nueva.id);
    return res.status(201).json(nueva);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// PUT /productos/:id
app.put('/productos/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const productos = readJSON('productos.json');
    const idx = productos.findIndex(p => p.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Producto no encontrado' });

    productos[idx] = { ...productos[idx], ...req.body };
    writeJSON('productos.json', productos);
    console.log('PUT /productos/:id -> actualizado id', id);
    return res.json(productos[idx]);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// DELETE /usuarios/:id (verifica integridad)
app.delete('/usuarios/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const usuarios = readJSON('usuarios.json');
    const ventas = readJSON('ventas.json');

    if (ventas.some(v => v.id_usuario === id)) {
      return res.status(400).json({ error: 'No se puede eliminar: usuario tiene ventas asociadas' });
    }

    const nuevos = usuarios.filter(u => u.id !== id);
    if (nuevos.length === usuarios.length) return res.status(404).json({ error: 'Usuario no encontrado' });

    writeJSON('usuarios.json', nuevos);
    console.log('DELETE /usuarios/:id -> eliminado id', id);
    return res.json({ mensaje: 'Usuario eliminado correctamente' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Catch-all para rutas equivocadas
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});

export default app;
