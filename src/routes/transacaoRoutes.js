import express from "express";
import TransacaoController from "../controllers/transacoesController.js";

const router = express.Router();

router.get("/transacoes", TransacaoController.listarTransacoes);
router.post("/transacoes", TransacaoController.criarTransacoes);

export default router;