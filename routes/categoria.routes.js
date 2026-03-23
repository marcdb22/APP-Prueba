import { Router } from "express";
import { crearCategoria, obtenerCategorias } from "../controllers/categoria.controller.js";

const router = Router();

router.get("/", obtenerCategorias);
router.post("/", crearCategoria);

export default router;
