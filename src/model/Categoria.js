import mongoose from "mongoose";

const categoriaSchema = new mongoose.Schema(
  {
    id: { type: mongoose.Schema.Types.ObjectId },
    nome: { type: String, required: true, unique: true },
    tipo: {
      type: String,
      enum: ["receita", "despesa"],
      required: true,
    },
  },
  { versionKey: false }
);

const Categoria = mongoose.model("categoria", categoriaSchema);

export default Categoria;
