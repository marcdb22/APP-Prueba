import mongoose from "mongoose";

const UsuarioSchema = new mongoose.Schema({
  email: String,
  password: String,
  dia_recarga: Number,
  saldo_total: Number,
  ultima_recarga: Date
});

export default mongoose.model("Usuario", UsuarioSchema);
