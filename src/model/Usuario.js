import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema({
    id: { type: mongoose.Schema.Types.ObjectId},
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    senha: { type: String, required: true },
}, {versionKey: false});

const usuario = mongoose.model("usuario", usuarioSchema);

export default usuario;