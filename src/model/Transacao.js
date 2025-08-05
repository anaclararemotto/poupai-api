import mongoose from "mongoose";

const transacaoSchema = new mongoose.Schema(
  {
    id: { type: mongoose.Schema.Types.ObjectId },
    tipo: {
      type: String,
      enum: ["receita", "despesa", "transferencia"],
      required: true,
    },
    valor: { type: Number, required: true },
    data: { type: Date, required: true, default: Date.now },
    categoria: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "categoria",
      required: false,
    },
    bancoOrigem: { type: mongoose.Schema.Types.ObjectId, ref: "bancos" },
    bancoDestino: { type: mongoose.Schema.Types.ObjectId, ref: "bancos" },
    conta: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "contas",
      required: true,
    },
    imgPath: String,
  },
  { versionKey: false, timestamps: true }
);

const Transacao = mongoose.model("transacao", transacaoSchema);

export default Transacao;
