// Importamos Express
const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

// Middleware para procesar JSON
app.use(express.json());

// RUTAS
// ----------------------

// 1️⃣ GET - Obtener todos los usuarios
app.get('/usuarios', (req, res) => {
  const data = fs.readFileSync(path.join(__dirname, '../data/usuarios.json'));
  res.json(JSON.parse(data));
});

// 2️⃣ GET - Obtener todos los productos
app.get('/productos', (req, res) => {
  const data = fs.readFileSync(path.join(__dirname, '../data/productos.json'));
  res.json(JSON.parse(data));
});

// 3️⃣ POST - Crear nuevo usuario
app.post('/usuarios', (req, res) => {
  const nuevoUsuario = req.body;
  const filePath = path.join(__dirname, '../data/usuarios.json');
  const data = JSON.parse(fs.readFileSync(filePath));
  nuevoUsuario.id = data.length + 1;
  data.push(nuevoUsuario);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  res.json({ mensaje: 'Usuario agregado correctamente', nuevoUsuario });
});

// 4️⃣ POST - Crear nueva venta
app.post('/ventas', (req, res) => {
  const nuevaVenta = req.body;
  const filePath = path.join(__dirname, '../data/ventas.json');
  const data = JSON.parse(fs.readFileSync(filePath));
  nuevaVenta.id = data.length + 1;
  data.push(nuevaVenta);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  res.json({ mensaje: 'Venta agregada correctamente', nuevaVenta });
});

// 5️⃣ PUT - Actualizar producto existente
app.put('/productos/:id', (req, res) => {
  const filePath = path.join(__dirname, '../data/productos.json');
  const data = JSON.parse(fs.readFileSync(filePath));
  const id = parseInt(req.params.id);
  const index = data.findIndex(p => p.id === id);
  if (index === -1) return res.status(404).json({ mensaje: 'Producto no encontrado' });
  data[index] = { ...data[index], ...req.body };
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  res.json({ mensaje: 'Producto actualizado', producto: data[index] });
});

// 6️⃣ DELETE - Eliminar usuario (verifica que no tenga ventas asociadas)
app.delete('/usuarios/:id', (req, res) => {
  const idUsuario = parseInt(req.params.id);
  const usuariosPath = path.join(__dirname, '../data/usuarios.json');
  const ventasPath = path.join(__dirname, '../data/ventas.json');
  const usuarios = JSON.parse(fs.readFileSync(usuariosPath));
  const ventas = JSON.parse(fs.readFileSync(ventasPath));

  const ventasUsuario = ventas.some(v => v.id_usuario === idUsuario);
  if (ventasUsuario) {
    return res.status(400).json({ mensaje: 'No se puede eliminar el usuario, tiene ventas asociadas' });
  }

  const nuevosUsuarios = usuarios.filter(u => u.id !== idUsuario);
  fs.writeFileSync(usuariosPath, JSON.stringify(nuevosUsuarios, null, 2));
  res.json({ mensaje: 'Usuario eliminado correctamente' });
});

// Servidor en puerto 3000
app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
