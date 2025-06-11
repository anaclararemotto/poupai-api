import mongoose from "mongoose";
import { usuarioSchema } from "./Usuario";

const contaSchema = new mongoose.Schema({
    id: { type: mongoose.Schema.Types.ObjectId },
    saldo : { type: Number, default: 0 },
    usuario: usuarioSchema
}, {versionKey: false});

const Conta = mongoose.model("conta", contaSchema);
export default Conta;