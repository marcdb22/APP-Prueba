import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { conectarDB } from "./config/db.js";

import categoriaRoutes from "../routes/categoria.routes.js";
import usuarioRoutes from "../routes/usuario.routes.js";
import gastoRoutes from "../routes/gasto.routes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Servir archivos estáticos de la carpeta frontend
app.use(express.static(path.join(__dirname, "../frontend")));

conectarDB();

// REGISTRO DE RUTAS
app.use("/categorias", categoriaRoutes);
app.use("/usuarios", usuarioRoutes);
app.use("/gastos", gastoRoutes);

// Ruta principal que devuelve el login
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

export default app;
