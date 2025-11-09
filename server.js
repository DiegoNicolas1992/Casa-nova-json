import express from 'express';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname)); // permite acceder a /data y otros archivos

// Rutas JSON
const usuariosPath = path.join(__dirname, 'data', 'usuarios.json');
const productosPath = path.join(__dirname, 'data', 'productos.json');
const ventasPath = path.join(__dirname, 'data', 'ventas.json');

// Endpoint para obtener productos
app.get('/productos', (req, res) => {
  fs.readFile(productosPath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Error al leer productos' });
    try {
      const productos = JSON.parse(data);
      res.json(productos);
    } catch {
      res.status(500).json({ error: 'Error al parsear productos' });
    }
  });
});

// Registro de usuario
app.post('/registro', (req, res) => {
  const { nombre, email, contraseña } = req.body;
  if (!nombre || !email || !contraseña)
    return res.status(400).json({ error: 'Datos incompletos' });

  fs.readFile(usuariosPath, 'utf8', (err, data) => {
    const usuarios = err ? [] : JSON.parse(data);
    if (usuarios.find(u => u.email === email))
      return res.status(400).json({ error: 'El usuario ya existe' });

    const hashed = bcrypt.hashSync(contraseña, 10);
    usuarios.push({ nombre, email, contraseña: hashed });

    fs.writeFile(usuariosPath, JSON.stringify(usuarios, null, 2), err => {
      if (err)
        return res.status(500).json({ error: 'Error al guardar usuario' });
      res.json({ mensaje: 'Usuario registrado correctamente' });
    });
  });
});

// Login de usuario
app.post('/login', (req, res) => {
  const { email, contraseña } = req.body;
  if (!email || !contraseña)
    return res.status(400).json({ error: 'Datos incompletos' });

  fs.readFile(usuariosPath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Error al leer usuarios' });
    const usuarios = JSON.parse(data);
    const usuario = usuarios.find(u => u.email === email);
    if (!usuario || !bcrypt.compareSync(contraseña, usuario.contraseña))
      return res.status(401).json({ error: 'Credenciales inválidas' });
    res.json({ mensaje: 'Login exitoso', usuario: { nombre: usuario.nombre, email: usuario.email } });
  });
});

// Endpoint de venta (compra)
app.post('/venta', (req, res) => {
  const { productos, total } = req.body;
  if (!productos || !Array.isArray(productos) || productos.length === 0 || !total)
    return res.status(400).json({ error: 'Datos de compra incompletos' });

  fs.readFile(ventasPath, 'utf8', (err, data) => {
    const ventas = err ? [] : JSON.parse(data);
    ventas.push({ productos, total, fecha: new Date().toISOString() });

    fs.writeFile(ventasPath, JSON.stringify(ventas, null, 2), err => {
      if (err) return res.status(500).json({ error: 'Error al guardar venta' });
      res.json({ mensaje: 'Compra realizada con éxito' });
    });
  });
});

// Iniciar servidor
app.listen(PORT, () => console.log(`✅ Servidor funcionando en http://localhost:${PORT}`));
