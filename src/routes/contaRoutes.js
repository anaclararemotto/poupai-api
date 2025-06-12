import express from "express";
import ContaController from "../controllers/ContaContoller.js";

const router = express.Router();

router.get("/conta", ContaController.listarContas);
router.get("/conta/:id", ContaController.listarContaPorId);
router.post("/conta", ContaController.cadastrarConta);

export default router;
