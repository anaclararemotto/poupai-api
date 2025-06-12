import express from "express";
import TransacaoController from "../controllers/transacoesController.js";

const router = express.Router();

router.get("/transacoes", TransacaoController.listarTransacoes);
router.get("/transacoes/:id", TransacaoController.listarTransacoesPorId);
router.post("/transacoes", TransacaoController.criarTransacoes);
router.delete("/transacoes/:id", TransacaoController.excluirTransacao);

export default router;