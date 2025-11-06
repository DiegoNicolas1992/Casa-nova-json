import express from "express";
import fs from "fs";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cors from "cors";

const app = express();
const PORT = 3000;
const SECRET = "clave_super_secreta"; // 🔐 Clave para JWT

app.use(express.json());
app.use(cors());
app.use(express.static("public"));

// 📁 Rutas de archivos JSON
const usuariosPath = "./data/usuarios.json";
const productosPath = "./data/productos.json";
const ventasPath = "./data/ventas.json";

// ✅ GET: Listar usuarios
app.get("/usuarios", (req, res) => {
  const usuarios = JSON.parse(fs.readFileSync(usuariosPath, "utf8"));
  res.json(usuarios);
});

// ✅ GET: Listar productos
app.get("/productos", (req, res) => {
  const productos = JSON.parse(fs.readFileSync(productosPath, "utf8"));
  res.json(productos);
});

// ✅ POST: Crear nuevo usuario con contraseña encriptada
app.post("/usuarios", async (req, res) => {
  const { nombre, apellido, email, contrasena } = req.body;

  if (!nombre || !apellido || !email || !contrasena) {
    return res.status(400).json({ error: "Faltan datos obligatorios" });
  }

  const usuarios = JSON.parse(fs.readFileSync(usuariosPath, "utf8"));
  const existe = usuarios.find(u => u.email === email);

  if (existe) {
    return res.status(400).json({ error: "El email ya está registrado" });
  }

  // 🔒 Encriptar contraseña
  const hashedPassword = await bcrypt.hash(contrasena, 10);

  const nuevoUsuario = {
    id: usuarios.length + 1,
    nombre,
    apellido,
    email,
    contrasena: hashedPassword,
    activo: true
  };

  usuarios.push(nuevoUsuario);
  fs.writeFileSync(usuariosPath, JSON.stringify(usuarios, null, 2));
  res.status(201).json({ mensaje: "Usuario registrado con éxito" });
});

// ✅ POST: Login con validación y token JWT
app.post("/login", (req, res) => {
  const { email, contrasena } = req.body;

  const usuarios = JSON.parse(fs.readFileSync(usuariosPath, "utf8"));
  const usuario = usuarios.find(u => u.email === email);

  if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });

  const valido = bcrypt.compareSync(contrasena, usuario.contrasena);
  if (!valido) return res.status(401).json({ error: "Contraseña incorrecta" });

  // 🔐 Crear token JWT
  const token = jwt.sign({ id: usuario.id, email: usuario.email }, SECRET, { expiresIn: "1h" });
  res.json({ mensaje: "Inicio de sesión correcto", token });
});

// 🔒 Middleware para verificar token
function verificarToken(req, res, next) {
  const header = req.headers["authorization"];
  if (!header) return res.status(403).json({ error: "Token requerido" });

  const token = header.split(" ")[1];
  try {
    jwt.verify(token, SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Token inválido o expirado" });
  }
}

// ✅ Ruta protegida (ejemplo de compra)
app.post("/comprar", verificarToken, (req, res) => {
  const { id_usuario, productos } = req.body;
  if (!id_usuario || !productos) {
    return res.status(400).json({ error: "Datos de compra incompletos" });
  }

  const ventas = JSON.parse(fs.readFileSync(ventasPath, "utf8"));
  const nuevaVenta = {
    id: ventas.length + 1,
    id_usuario,
    productos,
    total: productos.reduce((acc, p) => acc + p.precio * p.cantidad, 0),
    fecha: new Date().toISOString()
  };

  ventas.push(nuevaVenta);
  fs.writeFileSync(ventasPath, JSON.stringify(ventas, null, 2));
  res.json({ mensaje: "Compra registrada con éxito", venta: nuevaVenta });
});

// ✅ PUT: Actualizar producto
app.put("/productos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const productos = JSON.parse(fs.readFileSync(productosPath, "utf8"));
  const index = productos.findIndex(p => p.id === id);

  if (index === -1) return res.status(404).json({ error: "Producto no encontrado" });

  productos[index] = { ...productos[index], ...req.body };
  fs.writeFileSync(productosPath, JSON.stringify(productos, null, 2));
  res.json({ mensaje: "Producto actualizado con éxito" });
});

// ✅ DELETE: Eliminar usuario (solo si no tiene ventas)
app.delete("/usuarios/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const usuarios = JSON.parse(fs.readFileSync(usuariosPath, "utf8"));
  const ventas = JSON.parse(fs.readFileSync(ventasPath, "utf8"));

  const tieneVentas = ventas.some(v => v.id_usuario === id);
  if (tieneVentas) {
    return res.status(400).json({ error: "No se puede eliminar: el usuario tiene ventas asociadas" });
  }

  const nuevosUsuarios = usuarios.filter(u => u.id !== id);
  fs.writeFileSync(usuariosPath, JSON.stringify(nuevosUsuarios, null, 2));
  res.json({ mensaje: "Usuario eliminado con éxito" });
});

// 🚀 Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
