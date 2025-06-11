import express from "express";
import TransacaoController from "../controllers/transacoesController.js";

const router = express.Router();

router.post("/transacao", TransacaoController.criarTransacoes);

export default router;