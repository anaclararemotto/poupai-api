import express from "express";
import TransacaoController from "../controllers/transacoesController.js";
import { autenticarJWT } from "../auth/auth.js";

const router = express.Router();

router.use(autenticarJWT);

router.get("/transacoes", TransacaoController.listarTransacoes);
router.get("/transacoes/:id", TransacaoController.listarTransacoesPorId);
router.get("/total-receitas", autenticarJWT, TransacaoController.obterTotalReceitasMes);
router.get("/total-despesas", autenticarJWT, TransacaoController.obterTotalDespesasMes);
router.get("/receitas-mes", TransacaoController.getReceitasPorCategoriaMes);
router.get("/despesas-mes", TransacaoController.getDespesasPorCategoriaMes);
router.post("/transacoes", TransacaoController.criarTransacoes);
router.put("/transacoes/:id", TransacaoController.editarTransacao);
router.delete("/transacoes/:id", TransacaoController.excluirTransacao);

export default router;