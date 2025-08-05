import express from "express";
import { autenticarJWT } from "../auth/auth.js";
import BancoController from "../controllers/bancoController.js";

const router = express.Router();

router.get("/publico", BancoController.listarAlgunsBancosPublicos);

router.get("/", autenticarJWT, BancoController.listarBancos);
router.get("/:id", autenticarJWT, BancoController.listarBancoPorId);
router.post("/", autenticarJWT, BancoController.cadastrarBanco);
router.delete("/:id", autenticarJWT, BancoController.excluirBanco);

export default router;
