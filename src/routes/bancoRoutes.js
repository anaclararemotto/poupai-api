import express from "express";
import BancoController from "../controllers/bancoController.js";

const router = express.Router();

router.get("/banco", BancoController.listarBancos);
router.get("/banco/:id", BancoController.listarBancoPorId);
router.post("/banco", BancoController.cadastrarBanco);
router.delete("/banco/:id", BancoController.excluirBanco);

export default router;