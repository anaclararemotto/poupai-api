import express from "express";
import BancoController from "../controllers/bancoController.js";

const router = express.Router();

router.get("/banco", BancoController.listarBancos);
router.post("/banco", BancoController.cadastrarBanco);

export default router;