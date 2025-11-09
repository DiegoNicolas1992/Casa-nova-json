import express from "express";
import fs from "fs";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cors from "cors";

const app = express();
const PORT = 3000;
const SECRET = "clave_super_secreta";

app.use(express.json());
app.use(cors());
app.use(express.static("public"));

// Rutas JSON
const usuariosPath = "./data/usuarios.json";
const productosPath = "./data/productos.json";
const ventasPath = "./data/ventas.json";

// ✅ Listar productos
app.get("/productos", (req, res) => {
  const productos = JSON.parse(fs.readFileSync(productosPath, "utf8"));
  res.json(productos);
});

// ✅ Registrar nuevo usuario
app.post("/usuarios", async (req, res) => {
  const { nombre, apellido, email, contrasena } = req.body;
  if (!nombre || !apellido || !email || !contrasena) {
    return res.status(400).json({ error: "Faltan datos obligatorios" });
  }

  const usuarios = JSON.parse(fs.readFileSync(usuariosPath, "utf8"));
  const existe = usuarios.find(u => u.email === email);
  if (existe) return res.status(400).json({ error: "El email ya está registrado" });

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

// ✅ Login con JWT
app.post("/login", (req, res) => {
  const { email, contrasena } = req.body;
  const usuarios = JSON.parse(fs.readFileSync(usuariosPath, "utf8"));
  const usuario = usuarios.find(u => u.email === email);

  if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });
  const valido = bcrypt.compareSync(contrasena, usuario.contrasena);
  if (!valido) return res.status(401).json({ error: "Contraseña incorrecta" });

  const token = jwt.sign(
    { id: usuario.id, email: usuario.email },
    SECRET,
    { expiresIn: "1h" }
  );

  // ✅ devolvemos también el id y nombre
  res.json({
    mensaje: "Inicio de sesión correcto",
    token,
    usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email }
  });
});

// ✅ Middleware para verificar token
function verificarToken(req, res, next) {
  const header = req.headers["authorization"];
  if (!header) return res.status(403).json({ error: "Token requerido" });

  const token = header.split(" ")[1];
  try {
    const decoded = jwt.verify(token, SECRET);
    req.usuario = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Token inválido o expirado" });
  }
}

// ✅ Ruta de compra protegida
app.post("/comprar", verificarToken, (req, res) => {
  const { productos } = req.body;

  if (!productos || productos.length === 0) {
    return res.status(400).json({ error: "Datos de compra incompletos" });
  }

  const ventas = JSON.parse(fs.readFileSync(ventasPath, "utf8"));
  const nuevaVenta = {
    id: ventas.length + 1,
    id_usuario: req.usuario.id, // 🟢 se toma del token, no del body
    productos,
    total: productos.reduce((acc, p) => acc + p.precio * p.cantidad, 0),
    fecha: new Date().toISOString()
  };

  ventas.push(nuevaVenta);
  fs.writeFileSync(ventasPath, JSON.stringify(ventas, null, 2));
  res.json({ mensaje: "Compra registrada con éxito", venta: nuevaVenta });
});

app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
