import mongoose from "mongoose";

export const conectarDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Base de datos conectada");
  } catch (error) {
    console.error("Error al conectar DB", error);
    process.exit(1);
  }
};
