import mongoose from "mongoose";

const bancoSchema = new mongoose.Schema({
    id: { type: mongoose.Schema.Types.ObjectId },
    nome: { type: String, required: true, unique: true },
}, { versionKey: false });

const Banco = mongoose.model("bancos", bancoSchema);

export default Banco;