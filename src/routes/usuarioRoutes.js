import express from "express";
import UsuarioController from "../controllers/usuarioController.js";

const router = express.Router();

router.get("/usuario", UsuarioController.listarUsuarios);
router.get("/usuario/:id", UsuarioController.listarUsuariosPorId);
router.post("/usuario", UsuarioController.cadastrarUsuario);
router.post("/login", UsuarioController.loginUsuario);

export default router;