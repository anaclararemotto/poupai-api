import mongoose from "mongoose";

const contaSchema = new mongoose.Schema(
  {
    id: { type: mongoose.Schema.Types.ObjectId },
    saldo: { type: Number, default: 0 },
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "usuarios",
      required: true,
      unique: true,
    },
  },
  { versionKey: false }
);

const Conta = mongoose.model("contas", contaSchema);
export default Conta;
