import { Router } from "express";
import { loginUsuario, registroUsuario } from "../controllers/usuario.controller.js";

const router = Router();

// Endpoint para el login de los usuarios
router.post("/login", loginUsuario);

// Endpoint para registrar nuevos usuarios
router.post("/registro", registroUsuario);

export default router;