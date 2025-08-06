import express from "express";
import { autenticarJWT } from "../auth/auth.js";
import ContaController from "../controllers/ContaContoller.js";

const router = express.Router();

router.get("/conta", autenticarJWT, ContaController.minhaConta);
router.get("/conta", ContaController.listarContas);
router.get("/conta/:id", ContaController.listarContaPorId);
router.get("/minha", autenticarJWT, ContaController.obterContaDoUsuario);
router.post("/conta", ContaController.cadastrarConta);

export default router;
