import express from "express";
import ContaController from "../controllers/ContaContoller.js";
import { autenticarJWT } from "../auth/auth.js";

const router = express.Router();

router.get("/conta", autenticarJWT, ContaController.minhaConta);
router.get("/conta", ContaController.listarContas);
router.get("/conta/:id", ContaController.listarContaPorId);
router.post("/conta", ContaController.cadastrarConta);

export default router;
