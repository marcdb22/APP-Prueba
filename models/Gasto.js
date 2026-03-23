import mongoose from "mongoose";

const GastoSchema = new mongoose.Schema({
  usuario_id: String,
  categoria_id: String,
  cantidad: Number,
  fecha: { type: Date, default: Date.now }
});

export default mongoose.model("Gasto", GastoSchema);

