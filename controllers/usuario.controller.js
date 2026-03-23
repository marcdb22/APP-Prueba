import Usuario from "../models/Usuarios.js";

export const loginUsuario = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar al usuario por su email
    // Usamos findOne para que nos devuelva el primer objeto que coincida
    const usuario = await Usuario.findOne({ email });

    // Si no existe el usuario
    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    // Verificar la contraseña de forma básica (texto plano)
    // NOTA: Para producción se debería usar bcrypt para comparar hashes
    if (usuario.password !== password) {
      return res.status(401).json({ mensaje: "Contraseña incorrecta" });
    }

    // Si todo es correcto, devolvemos el usuario (sin la contraseña por seguridad en el frontend)
    res.json({
      mensaje: "Login exitoso",
      usuario: {
        _id: usuario._id,
        email: usuario.email,
        saldo_total: usuario.saldo_total
      }
    });

  } catch (error) {
    res.status(500).json({ mensaje: "Error en el servidor al intentar iniciar sesión", error });
  }
};

export const registroUsuario = async (req, res) => {
  try {
    const { email, password, dia_recarga, saldo_total, ultima_recarga } = req.body;

    // Verificar si el usuario ya existe
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ mensaje: "El correo electrónico ya está registrado." });
    }

    // Crear un nuevo usuario
    const nuevoUsuario = await Usuario.create({
      email,
      password, // NOTA: En producción esto debería ir hasheado (bcrypt)
      dia_recarga: dia_recarga || 1,
      saldo_total: saldo_total || 0,
      ultima_recarga: ultima_recarga || new Date()
    });

    res.status(201).json({ 
      mensaje: "Usuario registrado con éxito",
      usuario: {
        _id: nuevoUsuario._id,
        email: nuevoUsuario.email
      }
    });

  } catch (error) {
    res.status(500).json({ mensaje: "Error en el servidor al intentar registrar el usuario.", error });
  }
};
