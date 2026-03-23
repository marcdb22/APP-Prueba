import mongoose from "mongoose";

const CategoriaSchema = new mongoose.Schema({
  usuario_id: String,
  nombre: String,
  limite: Number,
  gastado: { type: Number, default: 0 }
});

export default mongoose.model("Categoria", CategoriaSchema);
