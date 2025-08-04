import express from "express";
import TransacaoController from "../controllers/transacoesController.js";
import { autenticarJWT } from "../auth/auth.js";

const router = express.Router();

router.use(autenticarJWT);

router.get("/transacoes", TransacaoController.listarTransacoes);
router.get("/transacoes/:id", TransacaoController.listarTransacoesPorId);
router.get("/total-receitas", TransacaoController.obterTotalReceitasMes);
router.get("/total-despesas",  TransacaoController.obterTotalDespesasMes);
router.post("/transacoes", TransacaoController.criarTransacoes);
router.put("/transacoes/:id", TransacaoController.editarTransacao);
router.delete("/transacoes/:id", TransacaoController.excluirTransacao);

export default router;