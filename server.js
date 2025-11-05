import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Rutas GET
app.get("/productos", (req, res) => {
  const productos = JSON.parse(fs.readFileSync("./data/productos.json", "utf8"));
  console.log(`GET /productos -> ${productos.length} registros`);
  res.json(productos);
});

app.get("/usuarios", (req, res) => {
  const usuarios = JSON.parse(fs.readFileSync("./data/usuarios.json", "utf8"));
  console.log(`GET /usuarios -> ${usuarios.length} registros`);
  res.json(usuarios);
});

// POST para ventas
app.post("/ventas", (req, res) => {
  const ventas = JSON.parse(fs.readFileSync("./data/ventas.json", "utf8"));
  const nuevaVenta = req.body;
  ventas.push(nuevaVenta);
  fs.writeFileSync("./data/ventas.json", JSON.stringify(ventas, null, 2));
  console.log("✅ Nueva venta registrada:", nuevaVenta);
  res.status(201).json({ mensaje: "Venta registrada correctamente" });
});

// Servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
