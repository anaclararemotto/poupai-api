import mongoose from "mongoose";

const transacaoSchema = new mongoose.Schema({
    id: { type: mongoose.Schema.Types.ObjectId },
    tipo: { type: String, enum: ["receita", "despesa", "transferencia"], required: true },
    valor: { type: Number, required: true },
    data: { type: Date, required: true },
    categoria: { type: String},
    bancoOrigem: { type: mongoose.Schema.Types.ObjectId, ref: "bancos" },
    bancoDestino: { type: mongoose.Schema.Types.ObjectId, ref: "bancos" },
}, { versionKey: false });

const Transacao = mongoose.model("transacao", transacaoSchema);

export default Transacao;