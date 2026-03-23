import Categoria from "../models/Categoria.js";

// Obtener todas las categorías
export const obtenerCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.find();
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las categorías" });
  }
};

// Crear una nueva categoría
export const crearCategoria = async (req, res) => {
  try {
    const { nombre, limite, usuario_id } = req.body;

    // Validación básica tal como solicitó el usuario
    if (!nombre || limite == null) {
      return res.status(400).json({ error: "El nombre y el límite (porcentaje) son requeridos" });
    }

    if (limite < 1 || limite > 100) {
      return res.status(400).json({ error: "El porcentaje debe estar entre 1 y 100" });
    }

    // Crear la categoría en MongoDB
    const nuevaCategoria = await Categoria.create({
      nombre,
      limite: Number(limite),
      usuario_id: usuario_id || null // Opcional dependiendo de si el usuario está logueado
    });

    // Status 201: Created
    res.status(201).json(nuevaCategoria);

  } catch (error) {
    console.error("Error al crear categoría:", error);
    res.status(500).json({ error: "Error al crear la categoría" });
  }
};
