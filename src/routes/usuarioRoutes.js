import express from "express";
import UsuarioController from "../controllers/usuarioController.js";

const router = express.Router();

router.post("/usuario", UsuarioController.cadastrarUsuario);

export default router;