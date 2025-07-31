import express from "express";
import BancoController from "../controllers/bancoController.js";
import { autenticarJWT } from "../auth/auth.js";

const router = express.Router();

router.get("/publico", BancoController.listarAlgunsBancosPublicos);

router.get("/", autenticarJWT, BancoController.listarBancos);
router.get("/:id", autenticarJWT, BancoController.listarBancoPorId);
router.post("/", autenticarJWT, BancoController.cadastrarBanco);
router.delete("/:id", autenticarJWT, BancoController.excluirBanco);

export default router;
